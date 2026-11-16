import React, { useState } from 'react'
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  Trash2,
  Wand2,
} from 'lucide-react'
import { PriorityLevel } from '../../types/email'
import { Button } from '../ui/Button'

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: {
    to: string
    subject: string
    body: string
    priority: PriorityLevel
  }) => void
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('medium')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleAiAssist = () => {
    if (!aiPrompt.trim()) return
    setIsGenerating(true)

    // Simulate smart AI drafting
    setTimeout(() => {
      setSubject(`Follow-up: ${aiPrompt.slice(0, 35)}...`)
      setBody(
        `Hi team,\n\nI wanted to follow up regarding: ${aiPrompt}.\n\nPlease let me know your thoughts and availability so we can align before the end of the week.\n\nBest regards,\nAlex Morgan`
      )
      setIsGenerating(false)
      setAiPrompt('')
    }, 800)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!to || !subject || !body) return

    onSend({
      to,
      subject,
      body,
      priority,
    })

    // Reset and close
    setTo('')
    setSubject('')
    setBody('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">New Message</h3>
              <p className="text-[11px] text-slate-400">MailPilot Intelligent Composer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Assist Prompt Pill */}
        <div className="p-3 bg-purple-50/70 border-b border-purple-100 flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-600 shrink-0 ml-2" />
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiAssist())}
            placeholder="Ask Gemini to draft: e.g. 'Politely request client sign-off on PR #409'..."
            className="flex-1 bg-white text-xs px-3 py-1.5 rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-slate-400"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAiAssist}
            isLoading={isGenerating}
            disabled={!aiPrompt.trim()}
            className="text-xs py-1"
          >
            Draft
          </Button>
        </div>

        {/* Compose Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              To
            </label>
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@company.com"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject of your email..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              />
            </div>

            <div className="w-40">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Message
            </label>
            <textarea
              required
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email here..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 leading-relaxed"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Discard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
