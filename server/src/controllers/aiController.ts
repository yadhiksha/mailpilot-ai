import { Request, Response } from 'express'
import { threadRepository } from '../config/db.js'
import { isGeminiConfigured } from '../config/gemini.js'
import {
  analyzeThreadWithGemini,
  generateCustomDraftWithGemini,
} from '../services/geminiService.js'

export async function getAiStatus(_req: Request, res: Response): Promise<void> {
  const configured = isGeminiConfigured()
  res.json({
    success: true,
    geminiConfigured: configured,
    model: 'gemini-1.5-flash',
    features: [
      'Automatic Reply Responsibility Classification',
      'Executive TL;DR Summaries',
      'Action Item & Deadline Extraction',
      'Multi-Tone Smart Draft Generation',
      'Manual Override Protection',
    ],
    message: configured
      ? 'Gemini API is active and ready.'
      : 'GEMINI_API_KEY is missing or invalid in server/.env. Live AI features will return clear configuration warnings.',
  })
}

export async function analyzeThread(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const thread = await threadRepository.getById(id)

    if (!thread) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    // Call actual Gemini API
    const aiResult = await analyzeThreadWithGemini(thread)

    // Update in database / store
    const updated = await threadRepository.update(id, {
      replyResponsibility: aiResult.replyResponsibility,
      classificationReason: aiResult.classificationReason,
      confidenceScore: aiResult.confidenceScore,
      requiresReview: aiResult.requiresReview,
      aiAnalysis: aiResult.aiAnalysis,
    })

    res.json({
      success: true,
      data: updated,
      isManualPreserved: aiResult.isManualPreserved,
    })
  } catch (err: any) {
    // Explicit error reporting (do not silently fake mock responses)
    res.status(502).json({
      success: false,
      isAiError: true,
      error: err.message,
      suggestion:
        'Verify your GEMINI_API_KEY in server/.env. Make sure it is valid from Google AI Studio.',
    })
  }
}

export async function generateDraft(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { instruction, tone } = req.body

    const thread = await threadRepository.getById(id)
    if (!thread) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    if (!instruction || !instruction.trim()) {
      res.status(400).json({ success: false, error: 'instruction is required' })
      return
    }

    const draft = await generateCustomDraftWithGemini(thread, instruction, tone)

    res.json({
      success: true,
      draft,
    })
  } catch (err: any) {
    res.status(502).json({
      success: false,
      isAiError: true,
      error: err.message,
    })
  }
}
