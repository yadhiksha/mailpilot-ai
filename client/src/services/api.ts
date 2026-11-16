import { Email, ReplyResponsibility } from '../types/email'

const API_BASE = '/api'

export interface BackendStatus {
  online: boolean
  geminiConfigured: boolean
  databaseStorage: string
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) })
    if (!res.ok) throw new Error('Health check failed')
    const data = await res.json()
    return {
      online: true,
      geminiConfigured: Boolean(data.geminiConfigured),
      databaseStorage: data.databaseStorage || 'in-memory-temporary',
    }
  } catch {
    return {
      online: false,
      geminiConfigured: false,
      databaseStorage: 'offline-local-cache',
    }
  }
}

export async function fetchThreadsFromBackend(): Promise<Email[]> {
  const res = await fetch(`${API_BASE}/threads`)
  if (!res.ok) {
    throw new Error(`Failed to fetch threads from backend (${res.statusText})`)
  }
  const json = await res.json()
  return json.data || []
}

export async function apiUpdateClassification(
  id: string,
  replyResponsibility: ReplyResponsibility,
  manualNote?: string
): Promise<Email> {
  const res = await fetch(`${API_BASE}/threads/${id}/classify`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyResponsibility, manualNote }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update classification')
  }
  const json = await res.json()
  return json.data
}

export async function apiDelegateThread(id: string, notes: string): Promise<Email> {
  const res = await fetch(`${API_BASE}/threads/${id}/delegate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delegate thread')
  }
  const json = await res.json()
  return json.data
}

export async function apiMarkHandled(id: string): Promise<Email> {
  const res = await fetch(`${API_BASE}/threads/${id}/handle`, {
    method: 'POST',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to mark handled')
  }
  const json = await res.json()
  return json.data
}

export async function apiReplyToThread(
  id: string,
  replyBody: string,
  senderName = 'Alex Morgan Office',
  senderEmail = 'assistant@mailpilot.ai'
): Promise<Email> {
  const res = await fetch(`${API_BASE}/threads/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ replyBody, senderName, senderEmail }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to send reply')
  }
  const json = await res.json()
  return json.data
}

export async function apiResolveTakeover(id: string): Promise<Email> {
  const res = await fetch(`${API_BASE}/threads/${id}/resolve-takeover`, {
    method: 'POST',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to resolve takeover')
  }
  const json = await res.json()
  return json.data
}

export async function apiAnalyzeThreadWithGemini(id: string): Promise<{ data: Email; isManualPreserved: boolean }> {
  const res = await fetch(`${API_BASE}/ai/analyze-thread/${id}`, {
    method: 'POST',
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Gemini API analysis failed')
  }
  return {
    data: json.data,
    isManualPreserved: Boolean(json.isManualPreserved),
  }
}

export async function apiGenerateDraftWithGemini(
  id: string,
  instruction: string,
  tone?: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/ai/generate-draft/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instruction, tone }),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Gemini Draft generation failed')
  }
  return json.draft
}
