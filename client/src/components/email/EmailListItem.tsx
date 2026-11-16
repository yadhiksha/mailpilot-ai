import React from 'react'
import { Star, Paperclip, CheckSquare, AlertCircle } from 'lucide-react'
import { Email, ReplyResponsibility } from '../../types/email'
import { Badge } from '../ui/Badge'
import { ClassificationBadge } from './ClassificationBadge'
import { cn } from '../../utils/cn'

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onSelect: (email: Email) => void
  onToggleStar: (e: React.MouseEvent, id: string) => void
  onUpdateClassification?: (id: string, newResp: ReplyResponsibility) => void
}

export const EmailListItem: React.FC<EmailListItemProps> = ({
  email,
  isSelected,
  onSelect,
  onToggleStar,
  onUpdateClassification,
}) => {
  const getPriorityVariant = (priority: Email['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'urgent'
      case 'high':
        return 'high'
      case 'medium':
        return 'medium'
      default:
        return 'low'
    }
  }

  const pendingActionCount =
    email.aiAnalysis?.actionItems?.filter((a) => !a.completed).length || 0

  return (
    <div
      onClick={() => onSelect(email)}
      className={cn(
        'group relative p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-150 border',
        isSelected
          ? 'bg-purple-50/70 border-purple-300 shadow-xs'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs',
        email.takeoverRequested && 'ring-1 ring-rose-300/80 bg-rose-50/20'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Star Button */}
        <button
          onClick={(e) => onToggleStar(e, email.id)}
          className="mt-0.5 text-slate-300 hover:text-amber-400 transition-colors p-0.5 rounded"
          title={email.isStarred ? 'Unstar' : 'Star'}
        >
          <Star
            className={cn(
              'w-4 h-4',
              email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            )}
          />
        </button>

        {/* Sender Avatar */}
        <div className="relative shrink-0">
          <img
            src={
              email.sender.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                email.sender.name
              )}&background=ede9fe&color=7c3aed`
            }
            alt={email.sender.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200/80"
          />
          {!email.isRead && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-600 border-2 border-white rounded-full shadow-2xs" />
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={cn(
                'text-xs truncate',
                !email.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
              )}
            >
              {email.sender.name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
              {email.timestamp}
            </span>
          </div>

          <h4
            className={cn(
              'text-xs truncate mb-1',
              !email.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'
            )}
          >
            {email.subject}
          </h4>

          <p className="text-xs text-slate-400 line-clamp-1 mb-2.5">
            {email.preview}
          </p>

          {/* Badges / AI indicators */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Takeover Alert Pill */}
            {email.takeoverRequested && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Takeover Request
              </span>
            )}

            {/* AI Reply Responsibility Badge with Manual Override */}
            <div onClick={(e) => e.stopPropagation()}>
              <ClassificationBadge
                responsibility={email.replyResponsibility}
                isManuallyClassified={email.isManuallyClassified}
                canEdit={true}
                onUpdateClassification={(newResp) =>
                  onUpdateClassification && onUpdateClassification(email.id, newResp)
                }
                size="sm"
              />
            </div>

            {/* Priority Badge */}
            <Badge variant={getPriorityVariant(email.priority)} size="sm">
              {email.priority}
            </Badge>

            {/* AI Action Items indicator */}
            {pendingActionCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                <CheckSquare className="w-3 h-3 text-indigo-600" />
                {pendingActionCount}
              </span>
            )}

            {/* Has Attachments Icon */}
            {email.attachments && email.attachments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                <Paperclip className="w-3 h-3 text-slate-400" />
                {email.attachments.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
