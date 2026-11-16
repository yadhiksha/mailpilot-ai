import React, { useState } from 'react'
import { X, Send, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'

interface DelegateModalProps {
  isOpen: boolean
  threadSubject: string
  onClose: () => void
  onConfirm: (notes: string) => void
}

export const DelegateModal: React.FC<DelegateModalProps> = ({
  isOpen,
  threadSubject,
  onClose,
  onConfirm,
}) => {
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const presets = [
    'Please draft a polite decline citing Q4 budget freeze.',
    'Ask them to reschedule to next Tuesday 2:00 PM EST.',
    'Counter-offer with our standard 99.95% SLA and 10% credit cap.',
    'Gather previous invoice history before responding.',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(notes.trim() || 'Client requested assistant takeover.')
    setNotes('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-modal border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Delegate to Assistant</h3>
              <p className="text-[11px] text-slate-400">Request executive assistant takeover</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Delegating Thread
            </span>
            <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 truncate">
              {threadSubject}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Instructions / Delegation Notes
              </label>
              <span className="text-[10px] text-purple-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Quick suggestions below
              </span>
            </div>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please negotiate a 15% discount before signing, or draft a polite counter-offer..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Preset Chips */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              One-Click Instructions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNotes(preset)}
                  className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 hover:bg-purple-100 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Protection Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-start gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-snug">
              This will update the classification to <strong>Assistant to Reply</strong> and protect it from automatic AI overwrites. The assistant will receive an instant high-priority takeover alert.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Confirm & Transfer</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
