import React, { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Archive,
  Trash2,
  Mail,
  Send,
  Reply,
  Sparkles,
  Paperclip,
  Download,
  FileText,
  Clock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Email, ReplyResponsibility } from '../../types/email'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ClassificationBadge } from './ClassificationBadge'
import { cn } from '../../utils/cn'

interface EmailDetailProps {
  email: Email
  onBack: () => void
  onToggleStar: (e: React.MouseEvent, id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onToggleRead: (id: string) => void
  onSendReply: (emailId: string, replyBody: string) => void
  onUpdateClassification?: (id: string, newResp: ReplyResponsibility) => void
  onResolveTakeover?: (id: string) => void
  initialReplyDraft?: string
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onBack,
  onToggleStar,
  onArchive,
  onDelete,
  onToggleRead,
  onSendReply,
  onUpdateClassification,
  onResolveTakeover,
  initialReplyDraft = '',
}) => {
  const [replyText, setReplyText] = useState(initialReplyDraft)
  const [isSending, setIsSending] = useState(false)
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})

  // Update replyText if initialReplyDraft changes from AI Copilot
  React.useEffect(() => {
    if (initialReplyDraft) {
      setReplyText(initialReplyDraft)
      setShowReplyBox(true)
    }
  }, [initialReplyDraft])

  const toggleMessageExpand = (msgId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }))
  }

  const handleSend = () => {
    if (!replyText.trim()) return
    setIsSending(true)
    setTimeout(() => {
      onSendReply(email.id, replyText)
      setReplyText('')
      setIsSending(false)
      setShowReplyBox(false)
    }, 600)
  }

  const messagesList = email.messages && email.messages.length > 0 ? email.messages : [
    {
      id: `msg-${email.id}`,
      sender: email.sender,
      recipients: email.recipients,
      timestamp: email.timestamp,
      body: email.body,
      attachments: email.attachments,
    }
  ]

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Top Action Toolbar */}
      <div className="h-14 border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            title="Back to list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => onToggleStar(e, email.id)}
            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-50 rounded-lg transition-colors"
            title={email.isStarred ? 'Unstar' : 'Star'}
          >
            <Star
              className={cn(
                'w-4 h-4',
                email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
              )}
            />
          </button>

          <button
            onClick={() => onArchive(email.id)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(email.id)}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleRead(email.id)}
            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title={email.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>

        {/* Classification & Priority Pills */}
        <div className="flex items-center gap-2">
          <ClassificationBadge
            responsibility={email.replyResponsibility}
            isManuallyClassified={email.isManuallyClassified}
            canEdit={true}
            onUpdateClassification={(newResp) =>
              onUpdateClassification && onUpdateClassification(email.id, newResp)
            }
            size="md"
          />

          <Badge
            variant={
              email.priority === 'urgent'
                ? 'urgent'
                : email.priority === 'high'
                ? 'high'
                : 'neutral'
            }
            size="md"
          >
            {email.priority}
          </Badge>
        </div>
      </div>

      {/* Main Email Scrollable View */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {/* Client Takeover Alert Banner (if applicable) */}
        {email.takeoverRequested && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Client Takeover Request (High Priority)</span>
              </div>
              {onResolveTakeover && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onResolveTakeover(email.id)}
                  className="text-xs py-1 px-2.5 bg-white text-rose-700 hover:bg-rose-100/70 border-rose-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acknowledge & Clear Alert</span>
                </Button>
              )}
            </div>

            <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs text-rose-900 leading-relaxed font-mono">
              <strong className="font-sans font-semibold text-rose-950 block mb-1">
                Instructions from Alex Morgan (Client):
              </strong>
              "{email.takeoverNote || 'Client requested assistant takeover.'}"
            </div>
          </div>
        )}

        {/* AI Classification Context Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/60 to-indigo-50/40 border border-purple-100 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-purple-900">
                  AI Classification: {email.replyResponsibility.toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-100/80 px-1.5 py-0.2 rounded">
                  {Math.round(email.confidenceScore * 100)}% Confidence
                </span>
                {email.isManuallyClassified && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Protected Manual Override
                  </span>
                )}
              </div>
              <p className="text-slate-600">{email.classificationReason}</p>
            </div>
          </div>
        </div>

        {/* Subject & Category Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 capitalize">
              {email.category}
            </span>
            {email.labels?.map((label) => (
              <span
                key={label}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                #{label}
              </span>
            ))}
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Thread ({messagesList.length} messages)
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
            {email.subject}
          </h1>
        </div>

        {/* Multi-Message Thread Conversation History */}
        <div className="space-y-4">
          {messagesList.map((msg, index) => {
            const isLatest = index === messagesList.length - 1
            const isExpanded = isLatest || expandedMessages[msg.id] !== false

            return (
              <div
                key={msg.id}
                className={cn(
                  'rounded-2xl border transition-all duration-150',
                  isLatest
                    ? 'border-purple-200/90 bg-white shadow-2xs'
                    : 'border-slate-200/80 bg-slate-50/50'
                )}
              >
                {/* Message Header Bar */}
                <div
                  onClick={() => !isLatest && toggleMessageExpand(msg.id)}
                  className={cn(
                    'p-4 flex items-center justify-between gap-3',
                    !isLatest && 'cursor-pointer hover:bg-slate-100/60'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        msg.sender.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          msg.sender.name
                        )}&background=ede9fe&color=7c3aed`
                      }
                      alt={msg.sender.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {msg.sender.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono truncate">
                          &lt;{msg.sender.email}&gt;
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        to {msg.recipients.map((r) => r.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.timestamp}
                    </span>
                    {!isLatest && (
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Body Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100">
                    <div className="prose prose-sm max-w-none text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line font-normal">
                      {msg.body}
                    </div>

                    {/* Attachments Section */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Paperclip className="w-3 h-3 text-slate-400" />
                          Attachments ({msg.attachments.length})
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.attachments.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-800 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 uppercase font-mono">
                                    {file.size}
                                  </p>
                                </div>
                              </div>

                              <button
                                className="p-1 text-slate-400 hover:text-purple-600 rounded-md transition-colors"
                                title="Download File"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Quick Reply / Response Box */}
        <div className="pt-2 border-t border-slate-100">
          {!showReplyBox ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowReplyBox(true)}
                className="gap-2"
              >
                <Reply className="w-4 h-4 text-purple-600" />
                <span>Reply to Thread</span>
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Reply className="w-3.5 h-3.5 text-purple-600" />
                  Replying as Assistant / Office of Alex Morgan
                </span>
                <button
                  onClick={() => setShowReplyBox(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response or use an AI Smart Draft from the right panel..."
                rows={4}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder-slate-400"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Gemini AI Drafting connected</span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSend}
                  isLoading={isSending}
                  disabled={!replyText.trim()}
                  className="gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
