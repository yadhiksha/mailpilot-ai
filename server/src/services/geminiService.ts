import { getGeminiClient, isGeminiConfigured } from '../config/gemini.js'
import { EmailThread, AIAnalysis, ReplyResponsibility } from '../types/thread.js'

export interface GeminiAnalysisResult {
  replyResponsibility: ReplyResponsibility
  classificationReason: string
  confidenceScore: number
  requiresReview: boolean
  aiAnalysis: AIAnalysis
  isManualPreserved?: boolean
}

const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest']
const MAX_RETRIES_PER_MODEL = 2

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }
  return cleaned.trim()
}

async function generateContentWithRetry(prompt: string): Promise<string> {
  const genAI = getGeminiClient()
  if (!genAI) {
    throw new Error('Gemini client could not be initialized.')
  }

  let lastError: Error | null = null

  for (const modelName of CANDIDATE_MODELS) {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.2,
      },
    })

    for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        console.log(`[Gemini Service] Calling ${modelName} (attempt ${attempt})...`)
        const result = await model.generateContent(prompt)
        const text = result.response.text()
        if (text && text.trim()) {
          console.log(`[Gemini Service] ✓ Successfully generated content using ${modelName}`)
          return text
        }
      } catch (err: any) {
        console.warn(`[Gemini Service] ${modelName} attempt ${attempt} notice: (${err.message?.slice(0, 80)}...)`)
        lastError = err
        if (attempt < MAX_RETRIES_PER_MODEL) {
          await new Promise((r) => setTimeout(r, 1200))
        }
      }
    }
  }

  throw lastError || new Error('Gemini API call failed after trying candidate models.')
}

export async function analyzeThreadWithGemini(thread: EmailThread): Promise<GeminiAnalysisResult> {
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API is not configured. Please set GEMINI_API_KEY in server/.env to enable live AI analysis.'
    )
  }

  // Format conversation history
  const conversationHistory = thread.messages
    .map(
      (m, i) =>
        `[Message ${i + 1}] From: ${m.sender.name} <${m.sender.email}> | Time: ${m.timestamp}\n${m.body}`
    )
    .join('\n\n---\n\n')

  const prompt = `You are the AI Executive Email Assistant for MailPilot AI.
Analyze the following multi-message email conversation thread and classify who is responsible for replying, summarize the key decisions, extract actionable tasks with deadlines, and draft 3 distinct reply options.

THREAD SUBJECT: "${thread.subject}"
CURRENT CLASSIFICATION: "${thread.replyResponsibility}"
MANUALLY OVERRIDDEN BY HUMAN ASSISTANT: ${thread.isManuallyClassified ? 'YES (PROTECTED)' : 'NO'}

FULL CONVERSATION HISTORY:
${conversationHistory}

CLASSIFICATION RULES:
1. "client": Assigned to the client/executive (Alex Morgan) when the email requires high-stakes authorization, contract sign-offs, investor term sheets, pricing approvals, personal sensitive matters, or founder decisions.
2. "assistant": Assigned to the executive assistant when the email involves administrative coordination, meeting scheduling, gathering documentation, standard operational follow-ups, or logistical replies.
3. "none": Assigned when the email is purely informational, an automated newsletter, receipt, system notification, or read-only report requiring zero reply.
4. "review": Assigned when the request is ambiguous, involves risky/unverified third parties, or classification confidence is below 0.75.

OUTPUT SPECIFICATION:
Return ONLY a valid JSON object matching this schema exactly (no markdown formatting, no code fences):
{
  "replyResponsibility": "client" | "assistant" | "none" | "review",
  "classificationReason": "Clear, concise sentence explaining why this classification was assigned based on thread context.",
  "confidenceScore": number between 0.50 and 1.0,
  "requiresReview": boolean (true if confidence < 0.75 or ambiguous),
  "summary": "2-3 sentence executive TL;DR summarizing the core situation and what is needed.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "actionItems": [
    {
      "id": "act-1",
      "task": "Actionable task description",
      "completed": false,
      "dueDate": "e.g. Today, 5:00 PM or specific deadline",
      "priority": "urgent" | "high" | "medium" | "low"
    }
  ],
  "suggestedReplies": [
    {
      "id": "rep-1",
      "title": "Short descriptive title",
      "tone": "professional" | "casual" | "concise" | "decline",
      "body": "Full professional reply draft ready to send"
    }
  ],
  "sentiment": "positive" | "neutral" | "urgent" | "frustrated",
  "urgencyScore": integer from 1 to 10,
  "sentimentScore": integer from 0 to 100,
  "estimatedReadTime": "e.g. 2 min",
  "detectedDeadline": "e.g. Today at 5:00 PM EST or null"
}`

  try {
    const responseText = await generateContentWithRetry(prompt)

    // Parse structured JSON safely
    const cleaned = cleanJsonString(responseText)
    const parsed = JSON.parse(cleaned)

    // Manual Classification Protection Rule:
    // If the thread was manually classified by the assistant or client, NEVER let Gemini overwrite it!
    const finalResponsibility: ReplyResponsibility = thread.isManuallyClassified
      ? thread.replyResponsibility
      : parsed.replyResponsibility || 'review'

    const finalReason = thread.isManuallyClassified
      ? thread.classificationReason
      : parsed.classificationReason || 'Analyzed by Gemini AI'

    const analysis: AIAnalysis = {
      summary: parsed.summary || 'Summary unavailable.',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      actionItems: Array.isArray(parsed.actionItems)
        ? parsed.actionItems.map((a: any, idx: number) => ({
            id: a.id || `act-${Date.now()}-${idx}`,
            task: a.task || 'Review item',
            completed: Boolean(a.completed),
            dueDate: a.dueDate,
            priority: a.priority || 'medium',
          }))
        : [],
      suggestedReplies: Array.isArray(parsed.suggestedReplies)
        ? parsed.suggestedReplies.map((r: any, idx: number) => ({
            id: r.id || `rep-${Date.now()}-${idx}`,
            title: r.title || 'Draft Reply',
            tone: r.tone || 'professional',
            body: r.body || '',
          }))
        : [],
      sentiment: parsed.sentiment || 'neutral',
      urgencyScore: typeof parsed.urgencyScore === 'number' ? parsed.urgencyScore : 5,
      sentimentScore: typeof parsed.sentimentScore === 'number' ? parsed.sentimentScore : 75,
      estimatedReadTime: parsed.estimatedReadTime || '1 min',
      detectedDeadline: parsed.detectedDeadline,
    }

    return {
      replyResponsibility: finalResponsibility,
      classificationReason: finalReason,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.85,
      requiresReview: Boolean(parsed.requiresReview),
      aiAnalysis: analysis,
      isManualPreserved: thread.isManuallyClassified,
    }
  } catch (err: any) {
    console.error('[Gemini Service] API Error:', err.message)
    throw new Error(`Gemini Analysis Failed: ${err.message}`)
  }
}

export async function generateCustomDraftWithGemini(
  thread: EmailThread,
  instruction: string,
  tone: 'professional' | 'concise' | 'casual' | 'decline' = 'professional'
): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new Error(
      'Gemini API is not configured. Please set GEMINI_API_KEY in server/.env to generate drafts.'
    )
  }

  const conversationHistory = thread.messages
    .map((m) => `From: ${m.sender.name} <${m.sender.email}>\n${m.body}`)
    .join('\n\n---\n\n')

  const prompt = `You are an executive email writer for MailPilot AI.
Draft an email response to this thread based strictly on the user's instructions.

SUBJECT: "${thread.subject}"
DESIRED TONE: ${tone}
INSTRUCTION / NOTE FROM USER: "${instruction}"

CONVERSATION CONTEXT:
${conversationHistory}

Write only the email body text. Do not include markdown code fences or meta commentary.`

  try {
    const text = await generateContentWithRetry(prompt)
    return text.trim()
  } catch (err: any) {
    console.error('[Gemini Service] Draft Generation Error:', err.message)
    throw new Error(`Draft Generation Failed: ${err.message}`)
  }
}
