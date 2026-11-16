import { Request, Response } from 'express'
import { threadRepository } from '../config/db.js'
import { EmailThread, ReplyResponsibility } from '../types/thread.js'

export async function getThreads(req: Request, res: Response): Promise<void> {
  try {
    const { folder, category, responsibility, unread, search } = req.query
    let threads = await threadRepository.getAll()

    if (folder && folder !== 'all') {
      threads = threads.filter((t) => t.folder === folder)
    }

    if (category && category !== 'all') {
      threads = threads.filter((t) => t.category === category)
    }

    if (responsibility && responsibility !== 'all') {
      if (responsibility === 'takeover') {
        threads = threads.filter((t) => t.takeoverRequested)
      } else {
        threads = threads.filter((t) => t.replyResponsibility === responsibility)
      }
    }

    if (unread === 'true') {
      threads = threads.filter((t) => !t.isRead)
    }

    if (typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase()
      threads = threads.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.sender.name.toLowerCase().includes(q) ||
          t.sender.email.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.aiAnalysis?.summary.toLowerCase().includes(q)
      )
    }

    res.json({
      success: true,
      count: threads.length,
      storageType: threadRepository.isUsingMongo() ? 'mongodb' : 'in-memory-temporary',
      data: threads,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export async function getThreadById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const thread = await threadRepository.getById(id)
    if (!thread) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }
    res.json({ success: true, data: thread })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export async function createThread(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body
    const newThread: EmailThread = {
      id: body.id || `thread-${Date.now()}`,
      folder: body.folder || 'sent',
      category: body.category || 'work',
      subject: body.subject || 'No Subject',
      preview: (body.body || '').slice(0, 100),
      timestamp: body.timestamp || 'Just now',
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: body.priority || 'medium',
      labels: body.labels || ['Outgoing'],
      messages: body.messages || [
        {
          id: `msg-${Date.now()}`,
          sender: body.sender || { name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' },
          recipients: body.recipients || [],
          timestamp: 'Just now',
          body: body.body || '',
        },
      ],
      sender: body.sender || { name: 'Alex Morgan', email: 'alex.morgan@mailpilot.ai' },
      recipients: body.recipients || [],
      body: body.body || '',
      replyResponsibility: 'none',
      classificationReason: 'Created by user.',
      confidenceScore: 1.0,
      requiresReview: false,
      isManuallyClassified: true,
      clientStatus: 'handled',
      takeoverRequested: false,
    }

    const created = await threadRepository.create(newThread)
    res.status(201).json({ success: true, data: created })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Requirement: Manual Classification Override (Protected against AI overwrites)
export async function updateClassification(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { replyResponsibility, manualNote } = req.body

    if (!replyResponsibility) {
      res.status(400).json({ success: false, error: 'replyResponsibility is required' })
      return
    }

    const current = await threadRepository.getById(id)
    if (!current) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    const updated = await threadRepository.update(id, {
      replyResponsibility: replyResponsibility as ReplyResponsibility,
      isManuallyClassified: true, // PROTECTED FLAG
      manualOverrideNote: manualNote || 'Manually classified by Assistant',
      classificationReason: `Manually classified as ${replyResponsibility} by Assistant (Protected from AI overwrites).`,
      clientStatus: replyResponsibility === 'client' ? 'pending' : current.clientStatus,
    })

    res.json({
      success: true,
      message: 'Classification updated and protected from AI auto-overwrites',
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Requirement: Delegate to Assistant (Takeover Workflow)
export async function delegateThread(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { notes } = req.body

    const current = await threadRepository.getById(id)
    if (!current) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    const updated = await threadRepository.update(id, {
      replyResponsibility: 'assistant',
      clientStatus: 'delegated',
      takeoverRequested: true,
      takeoverNote: notes || 'Client requested assistant takeover.',
      isManuallyClassified: true, // PROTECTED
      manualOverrideNote: 'Delegated by Client (Alex Morgan)',
      classificationReason: `Delegated by Client to Assistant with instructions: "${notes || 'Takeover requested'}"`,
      handledAt: new Date().toLocaleTimeString(),
    })

    res.json({
      success: true,
      message: 'Thread successfully delegated to assistant. Takeover alert dispatched.',
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Requirement: Mark as Handled (Client resolution)
export async function markHandled(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params

    const current = await threadRepository.getById(id)
    if (!current) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    const updated = await threadRepository.update(id, {
      clientStatus: 'handled',
      handledAt: new Date().toLocaleTimeString(),
    })

    res.json({
      success: true,
      message: 'Thread marked as handled by client.',
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Requirement: Send Reply to Thread
export async function replyToThread(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { replyBody, senderName, senderEmail } = req.body

    if (!replyBody || !replyBody.trim()) {
      res.status(400).json({ success: false, error: 'replyBody is required' })
      return
    }

    const current = await threadRepository.getById(id)
    if (!current) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    const newReplyMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        name: senderName || 'Alex Morgan Office',
        email: senderEmail || 'assistant@mailpilot.ai',
      },
      recipients: [current.sender],
      timestamp: 'Just now',
      body: replyBody,
    }

    const updated = await threadRepository.update(id, {
      messages: [...current.messages, newReplyMessage],
      replyResponsibility: 'none',
      takeoverRequested: false, // Resolved takeover
    })

    res.json({
      success: true,
      message: 'Reply sent successfully.',
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Requirement: Acknowledge & Clear Takeover Alert
export async function resolveTakeover(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params

    const current = await threadRepository.getById(id)
    if (!current) {
      res.status(404).json({ success: false, error: 'Thread not found' })
      return
    }

    const updated = await threadRepository.update(id, {
      takeoverRequested: false,
    })

    res.json({
      success: true,
      message: 'Takeover alert cleared.',
      data: updated,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// Helper: Reset to seed data
export async function resetSeed(req: Request, res: Response): Promise<void> {
  try {
    await threadRepository.resetSeed()
    const all = await threadRepository.getAll()
    res.json({
      success: true,
      message: 'Reset data back to clean seed threads.',
      count: all.length,
      data: all,
    })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}
