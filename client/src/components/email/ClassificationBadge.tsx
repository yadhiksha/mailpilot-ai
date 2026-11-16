import React, { useState, useRef, useEffect } from 'react'
import {
  User,
  Briefcase,
  MinusCircle,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { ReplyResponsibility } from '../../types/email'
import { cn } from '../../utils/cn'

interface ClassificationBadgeProps {
  responsibility: ReplyResponsibility
  isManuallyClassified?: boolean
  canEdit?: boolean
  onUpdateClassification?: (newResponsibility: ReplyResponsibility) => void
  size?: 'sm' | 'md'
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  responsibility,
  isManuallyClassified = false,
  canEdit = false,
  onUpdateClassification,
  size = 'sm',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const config = {
    client: {
      label: 'Client to Reply',
      icon: User,
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/90',
      dotClass: 'bg-purple-600',
    },
    assistant: {
      label: 'Assistant to Reply',
      icon: Briefcase,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/90',
      dotClass: 'bg-blue-600',
    },
    none: {
      label: 'No Reply Needed',
      icon: MinusCircle,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
    },
    review: {
      label: 'Needs Review',
      icon: AlertTriangle,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      dotClass: 'bg-amber-500 animate-pulse',
    },
  }[responsibility]

  const Icon = config.icon

  const options: Array<{ id: ReplyResponsibility; label: string; desc: string }> = [
    {
      id: 'assistant',
      label: 'Assistant to Reply',
      desc: 'Administrative, scheduling, or operational tasks',
    },
    {
      id: 'client',
      label: 'Client to Reply',
      desc: 'High-stakes decisions, contracts, executive approvals',
    },
    {
      id: 'review',
      label: 'Needs Review',
      desc: 'Ambiguous tone or uncertain next steps',
    },
    {
      id: 'none',
      label: 'No Reply Needed',
      desc: 'Informational updates, newsletters, receipts',
    },
  ]

  const handleSelect = (newResp: ReplyResponsibility) => {
    if (onUpdateClassification) {
      onUpdateClassification(newResp)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        disabled={!canEdit}
        onClick={() => canEdit && setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border transition-all duration-150 font-medium select-none',
          config.badgeClass,
          size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
          canEdit && 'hover:shadow-xs cursor-pointer active:scale-95'
        )}
        title={
          isManuallyClassified
            ? 'Manually overridden by Assistant (Protected from AI overwrites)'
            : 'AI classified'
        }
      >
        <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{config.label}</span>

        {isManuallyClassified && (
          <span title="Manual override (Protected from AI)">
            <ShieldCheck className="w-3 h-3 text-emerald-600 ml-0.5" />
          </span>
        )}

        {canEdit && (
          <ChevronDown
            className={cn(
              'w-3 h-3 text-slate-400 transition-transform duration-150',
              isOpen && 'rotate-180 text-slate-700'
            )}
          />
        )}
      </button>

      {/* Manual Classification Dropdown Menu */}
      {isOpen && canEdit && (
        <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Manual Override
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Protected
            </span>
          </div>

          <div className="p-1 space-y-0.5">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  'w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-start justify-between gap-2 transition-colors',
                  responsibility === opt.id
                    ? 'bg-purple-50 text-purple-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <div>
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                    {opt.desc}
                  </p>
                </div>
                {responsibility === opt.id && (
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
