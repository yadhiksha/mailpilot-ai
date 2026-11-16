import React, { useState } from 'react'
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Inbox,
  Paperclip,
  Check,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react'
import { Email } from '../../types/email'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { DelegateModal } from '../email/DelegateModal'
import { cn } from '../../utils/cn'

interface ClientDashboardProps {
  emails: Email[]
  onMarkAsHandled: (emailId: string) => void
  onDelegateToAssistant: (emailId: string, notes: string) => void
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  emails,
  onMarkAsHandled,
  onDelegateToAssistant,
}) => {
  // Filter for client emails: where replyResponsibility === 'client' OR clientStatus === 'handled'
  const [activeTab, setActiveTab] = useState<'pending' | 'handled'>('pending')
  const [selectedThreadId, setSelectedThreadId] = useState<string>('')
  const [delegatingThread, setDelegatingThread] = useState<Email | null>(null)
  const [justHandledId, setJustHandledId] = useState<string | null>(null)

  const pendingEmails = emails.filter(
    (e) => e.replyResponsibility === 'client' && e.clientStatus === 'pending'
  )

  const handledEmails = emails.filter(
    (e) => e.clientStatus === 'handled'
  )

  const displayedEmails = activeTab === 'pending' ? pendingEmails : handledEmails

  // Select first email by default
  const activeEmail =
    emails.find((e) => e.id === selectedThreadId) || displayedEmails[0] || null

  const handleMarkHandled = (id: string) => {
    setJustHandledId(id)
    setTimeout(() => {
      onMarkAsHandled(id)
      setJustHandledId(null)
    }, 400)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
      {/* Executive Welcome Banner */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-purple-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Client Executive Workspace</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/70">
                Alex Morgan
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Curated view: Only emails requiring your personal executive reply or authorization.
            </p>
          </div>
        </div>

        {/* Pending vs Handled Segmented Pill */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all select-none',
              activeTab === 'pending'
                ? 'bg-white text-purple-900 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Needs My Action</span>
            <span className="ml-1 text-[11px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full">
              {pendingEmails.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('handled')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all select-none',
              activeTab === 'handled'
                ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            )}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Handled History</span>
            <span className="ml-1 text-[11px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full">
              {handledEmails.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Client Feed + Reading & Action Center */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Client Email Cards */}
        <div className="w-full md:w-96 lg:w-[420px] border-r border-slate-200/80 bg-white/60 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{activeTab === 'pending' ? 'Pending Attention' : 'Resolved Archive'}</span>
            <span>{displayedEmails.length} items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {displayedEmails.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-700">Inbox Zero for Client!</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  {activeTab === 'pending'
                    ? 'All executive emails are handled or delegated to your assistant.'
                    : 'No handled emails in this session yet.'}
                </p>
              </div>
            ) : (
              displayedEmails.map((email) => {
                const isSelected = activeEmail?.id === email.id
                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedThreadId(email.id)}
                    className={cn(
                      'p-4 rounded-2xl border cursor-pointer transition-all duration-150',
                      isSelected
                        ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs',
                      justHandledId === email.id && 'opacity-30 scale-95'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {email.sender.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {email.timestamp}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                      {email.subject}
                    </h4>

                    {/* AI Executive Summary Snippet */}
                    {email.aiAnalysis?.summary && (
                      <div className="p-2 rounded-xl bg-purple-50/50 border border-purple-100 text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                        <strong className="text-purple-700 font-semibold">AI TL;DR: </strong>
                        {email.aiAnalysis.summary}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <Badge
                        variant={
                          email.priority === 'urgent'
                            ? 'urgent'
                            : email.priority === 'high'
                            ? 'high'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {email.priority}
                      </Badge>

                      {email.clientStatus === 'handled' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Handled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <User className="w-3 h-3" /> Client to Reply
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Thread Reading View & Client Action Bar */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {activeEmail ? (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Top Executive Action Header */}
              <div className="p-4 md:px-8 border-b border-slate-200/80 bg-gradient-to-r from-purple-50/40 via-white to-indigo-50/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="md">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Client Responsibility
                  </Badge>

                  {activeEmail.clientStatus === 'handled' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Handled by Alex
                    </span>
                  )}
                </div>

                {/* Primary Executive Actions */}
                <div className="flex items-center gap-2.5">
                  {activeEmail.clientStatus !== 'handled' && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setDelegatingThread(activeEmail)}
                        className="gap-1.5 text-xs py-1.5"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                        <span>Delegate to Assistant</span>
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleMarkHandled(activeEmail.id)}
                        className="gap-1.5 text-xs py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Handled</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Scrollable Reading Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {/* 1. Large Executive AI Summary Card */}
                {activeEmail.aiAnalysis && (
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50/80 via-indigo-50/40 to-white border border-purple-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                          Executive Summary & Decision Context
                        </h3>
                      </div>

                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                        Urgency: {activeEmail.aiAnalysis.urgencyScore}/10
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
                      {activeEmail.aiAnalysis.summary}
                    </p>

                    {/* Key Highlights */}
                    {activeEmail.aiAnalysis.keyPoints?.length > 0 && (
                      <div className="pt-3 border-t border-purple-100/80">
                        <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-2">
                          Key Decision Highlights
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {activeEmail.aiAnalysis.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Classification Rationale Callout */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-0.5">
                      Why this is assigned to you (Client):
                    </span>
                    <p className="text-xs text-slate-600">
                      {activeEmail.classificationReason}
                    </p>
                  </div>
                </div>

                {/* Subject Header */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    {activeEmail.subject}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeEmail.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{lbl}
                      </span>
                    ))}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeEmail.messages.length} message(s) in thread
                    </span>
                  </div>
                </div>

                {/* Conversation Thread History */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Full Thread History
                  </h4>

                  {activeEmail.messages.map((msg, index) => {
                    const isLatest = index === activeEmail.messages.length - 1
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          'p-5 rounded-2xl border transition-all',
                          isLatest
                            ? 'bg-white border-purple-200/90 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200/70'
                        )}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                msg.sender.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  msg.sender.name
                                )}&background=ede9fe&color=7c3aed`
                              }
                              alt={msg.sender.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-900">
                                {msg.sender.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono ml-2">
                                &lt;{msg.sender.email}&gt;
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                          {msg.body}
                        </div>

                        {/* Attachments if any */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                            {msg.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                              >
                                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                                <span>{att.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({att.size})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
              <div>
                <Inbox className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">No Email Selected</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a client email from the left column to review.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delegate to Assistant Modal */}
      {delegatingThread && (
        <DelegateModal
          isOpen={true}
          threadSubject={delegatingThread.subject}
          onClose={() => setDelegatingThread(null)}
          onConfirm={(notes) => onDelegateToAssistant(delegatingThread.id, notes)}
        />
      )}
    </div>
  )
}
