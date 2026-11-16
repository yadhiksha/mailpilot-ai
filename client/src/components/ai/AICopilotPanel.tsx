import React, { useState } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Clock,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { AIAnalysis, SuggestedReply } from '../../types/email'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface AICopilotPanelProps {
  analysis?: AIAnalysis
  onSelectReply?: (replyText: string) => void
  onToggleActionItem?: (actionId: string) => void
  onTriggerLiveAnalysis?: () => void
  isAnalyzing?: boolean
  aiError?: string | null
  geminiConfigured?: boolean
}

export const AICopilotPanel: React.FC<AICopilotPanelProps> = ({
  analysis,
  onSelectReply,
  onToggleActionItem,
  onTriggerLiveAnalysis,
  isAnalyzing = false,
  aiError = null,
  geminiConfigured = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (reply: SuggestedReply) => {
    navigator.clipboard.writeText(reply.body)
    setCopiedId(reply.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'text-rose-600 bg-rose-50 border-rose-200'
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  }

  return (
    <div className="space-y-4">
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Gemini Copilot</h3>
            <p className="text-[10px] text-slate-400 font-medium">Deep Thread Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant={geminiConfigured ? 'brand' : 'neutral'} size="sm">
            <Zap className={cn('w-3 h-3', geminiConfigured ? 'text-purple-600' : 'text-slate-400')} />
            {geminiConfigured ? 'Gemini 1.5' : 'Key Needed'}
          </Badge>
        </div>
      </div>

      {/* Live AI Analysis Trigger CTA */}
      {onTriggerLiveAnalysis && (
        <button
          onClick={onTriggerLiveAnalysis}
          disabled={isAnalyzing}
          className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/70 text-purple-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={cn('w-3.5 h-3.5 text-purple-600', isAnalyzing && 'animate-spin')} />
          <span>{isAnalyzing ? 'Analyzing Thread with Gemini API...' : 'Run Live Gemini Analysis'}</span>
        </button>
      )}

      {/* Transparent Error Banner when Gemini fails or key missing */}
      {aiError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Gemini API Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">{aiError}</p>
        </div>
      )}

      {!analysis ? (
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 mb-1">No AI Insights Yet</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Click "Run Live Gemini Analysis" above to generate an executive summary, action items, and smart drafts.
          </p>
        </div>
      ) : (
        <>
          {/* Intelligence Badges (Sentiment, Urgency, Read Time) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Urgency
              </span>
              <span
                className={cn(
                  'inline-block text-xs font-bold px-2 py-0.5 rounded-md border',
                  getUrgencyColor(analysis.urgencyScore)
                )}
              >
                {analysis.urgencyScore}/10
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Sentiment
              </span>
              <span className="text-xs font-semibold text-slate-700 capitalize">
                {analysis.sentiment}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                Read Time
              </span>
              <span className="text-xs font-semibold text-slate-700 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {analysis.estimatedReadTime}
              </span>
            </div>
          </div>

          {/* Executive Summary Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-white border border-purple-100/90 shadow-2xs">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Executive TL;DR Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {analysis.summary}
            </p>

            {analysis.keyPoints && analysis.keyPoints.length > 0 && (
              <ul className="mt-3 pt-3 border-t border-purple-100/70 space-y-1.5 text-xs text-slate-600">
                {analysis.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action Items & Deadlines */}
          {analysis.actionItems && analysis.actionItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Detected Action Items
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {analysis.actionItems.filter((a) => a.completed).length}/
                  {analysis.actionItems.length} Done
                </span>
              </div>

              <div className="space-y-2">
                {analysis.actionItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleActionItem && onToggleActionItem(item.id)}
                    className={cn(
                      'flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none',
                      item.completed
                        ? 'bg-slate-50/80 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-2xs'
                    )}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-purple-600 shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 hover:text-purple-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-xs font-medium leading-snug',
                          item.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800'
                        )}
                      >
                        {item.task}
                      </p>
                      {item.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {item.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Suggested Replies */}
          {analysis.suggestedReplies && analysis.suggestedReplies.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Smart Drafts</span>
              </div>

              <div className="space-y-2.5">
                {analysis.suggestedReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-3 rounded-xl bg-white border border-slate-200/90 hover:border-purple-300 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-800">
                        {reply.title}
                      </span>
                      <Badge variant="accent" size="sm">
                        {reply.tone}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-2.5 leading-relaxed bg-slate-50/70 p-2 rounded-lg font-mono text-[11px]">
                      {reply.body}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopy(reply)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        {copiedId === reply.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSelectReply && onSelectReply(reply.body)}
                        className="text-[11px] py-1 px-2.5"
                      >
                        <span>Use Draft</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
