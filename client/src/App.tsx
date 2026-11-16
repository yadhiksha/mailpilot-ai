import { useState, useMemo, useEffect } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { EmailListItem } from './components/email/EmailListItem'
import { EmailDetail } from './components/email/EmailDetail'
import { AICopilotPanel } from './components/ai/AICopilotPanel'
import { ComposeModal } from './components/email/ComposeModal'
import { ClientDashboard } from './components/client/ClientDashboard'
import { INITIAL_EMAILS } from './data/mockEmails'
import {
  Email,
  EmailFolder,
  EmailCategory,
  PriorityLevel,
  ReplyResponsibility,
  UserPersona,
} from './types/email'
import {
  checkBackendStatus,
  fetchThreadsFromBackend,
  apiUpdateClassification,
  apiDelegateThread,
  apiMarkHandled,
  apiReplyToThread,
  apiResolveTakeover,
  apiAnalyzeThreadWithGemini,
} from './services/api'
import { Mail, Inbox, AlertCircle, ArrowRight } from 'lucide-react'

export function App() {
  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS)
  const [selectedEmailId, setSelectedEmailId] = useState<string>(INITIAL_EMAILS[0]?.id || '')
  const [currentPersona, setCurrentPersona] = useState<UserPersona>('assistant')
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>('inbox')
  const [currentCategory, setCurrentCategory] = useState<EmailCategory>('all')
  const [currentResponsibility, setCurrentResponsibility] = useState<ReplyResponsibility | 'all' | 'takeover'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'all'>('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [activeDraft, setActiveDraft] = useState<string>('')

  // Phase 4 Backend & Gemini Integration States
  const [backendOnline, setBackendOnline] = useState(false)
  const [geminiConfigured, setGeminiConfigured] = useState(false)
  const [databaseStorage, setDatabaseStorage] = useState('connecting...')
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Initial Sync with Backend
  const syncWithBackend = async () => {
    setIsSyncing(true)
    try {
      const status = await checkBackendStatus()
      setBackendOnline(status.online)
      setGeminiConfigured(status.geminiConfigured)
      setDatabaseStorage(status.databaseStorage)

      if (status.online) {
        const backendThreads = await fetchThreadsFromBackend()
        if (backendThreads && backendThreads.length > 0) {
          setEmails(backendThreads)
          if (!selectedEmailId && backendThreads[0]) {
            setSelectedEmailId(backendThreads[0].id)
          }
        }
      }
    } catch (err) {
      console.warn('[Sync] Backend unreachable, using client cache.', err)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    syncWithBackend()
  }, [])

  // Derived Counts
  const takeoverCount = useMemo(() => {
    return emails.filter((e) => e.takeoverRequested).length
  }, [emails])

  const clientPendingCount = useMemo(() => {
    return emails.filter((e) => e.replyResponsibility === 'client' && e.clientStatus === 'pending').length
  }, [emails])

  const assistantCount = useMemo(() => {
    return emails.filter((e) => e.replyResponsibility === 'assistant' && !e.isArchived).length
  }, [emails])

  const clientCount = useMemo(() => {
    return emails.filter((e) => e.replyResponsibility === 'client' && !e.isArchived).length
  }, [emails])

  const reviewCount = useMemo(() => {
    return emails.filter((e) => e.replyResponsibility === 'review' && !e.isArchived).length
  }, [emails])

  const unreadCount = useMemo(() => {
    return emails.filter((e) => e.folder === 'inbox' && !e.isRead && !e.isArchived).length
  }, [emails])

  const starredCount = useMemo(() => {
    return emails.filter((e) => e.isStarred && !e.isArchived).length
  }, [emails])

  // Filtered emails for Assistant View
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Responsibility / Takeover filter
      if (currentResponsibility === 'takeover') {
        if (!email.takeoverRequested) return false
      } else if (currentResponsibility !== 'all') {
        if (email.replyResponsibility !== currentResponsibility) return false
      }

      // Folder filter
      if (currentResponsibility === 'all') {
        if (currentFolder === 'starred') {
          if (!email.isStarred) return false
        } else if (currentFolder === 'archive') {
          if (!email.isArchived) return false
        } else {
          if (email.folder !== currentFolder || email.isArchived) return false
        }
      }

      // Category filter
      if (currentCategory !== 'all' && email.category !== currentCategory) {
        return false
      }

      // Priority filter
      if (priorityFilter !== 'all' && email.priority !== priorityFilter) {
        return false
      }

      // Unread only
      if (unreadOnly && email.isRead) {
        return false
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesSubject = email.subject.toLowerCase().includes(query)
        const matchesSender = email.sender.name.toLowerCase().includes(query) || email.sender.email.toLowerCase().includes(query)
        const matchesBody = email.body.toLowerCase().includes(query)
        const matchesAi = email.aiAnalysis?.summary.toLowerCase().includes(query) || false
        if (!matchesSubject && !matchesSender && !matchesBody && !matchesAi) {
          return false
        }
      }

      return true
    })
  }, [emails, currentResponsibility, currentFolder, currentCategory, priorityFilter, unreadOnly, searchQuery])

  // Current selected email in Assistant View
  const selectedEmail = useMemo(() => {
    return emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || null
  }, [emails, selectedEmailId, filteredEmails])

  // Handlers
  const handleSelectEmail = (email: Email) => {
    setSelectedEmailId(email.id)
    if (!email.isRead) {
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
      )
    }
  }

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    )
  }

  const handleArchive = (id: string) => {
    setEmails((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isArchived: true, folder: 'archive' } : item
      )
    )
  }

  const handleDelete = (id: string) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, folder: 'trash' } : item))
    )
  }

  const handleToggleRead = (id: string) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: !item.isRead } : item))
    )
  }

  // Phase 4 Requirement: Manual Classification Override (Protected & Synced to Backend)
  const handleUpdateClassification = async (id: string, newResp: ReplyResponsibility) => {
    // 1. Optimistic UI update
    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            replyResponsibility: newResp,
            isManuallyClassified: true,
            manualOverrideNote: 'Manually classified by Assistant',
            classificationReason: `Manually classified as ${newResp} by Assistant (Protected from automatic AI overwrites).`,
            clientStatus: newResp === 'client' ? 'pending' : item.clientStatus,
          }
        }
        return item
      })
    )

    // 2. Persist to backend API
    try {
      if (backendOnline) {
        await apiUpdateClassification(id, newResp)
      }
    } catch (err) {
      console.error('[API] Failed to update classification on server', err)
    }
  }

  // Phase 4 Requirement: Client Marks as Handled (Synced to Backend)
  const handleMarkAsHandled = async (emailId: string) => {
    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === emailId) {
          return {
            ...item,
            clientStatus: 'handled',
            handledAt: 'Just now',
          }
        }
        return item
      })
    )

    try {
      if (backendOnline) {
        await apiMarkHandled(emailId)
      }
    } catch (err) {
      console.error('[API] Failed to mark handled on server', err)
    }
  }

  // Phase 4 Requirement: Client Delegates to Assistant (Synced to Backend)
  const handleDelegateToAssistant = async (emailId: string, notes: string) => {
    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === emailId) {
          return {
            ...item,
            replyResponsibility: 'assistant',
            clientStatus: 'delegated',
            takeoverRequested: true,
            takeoverNote: notes,
            isManuallyClassified: true,
            manualOverrideNote: 'Delegated by Client (Alex Morgan)',
            classificationReason: `Delegated by Client to Assistant with instructions: "${notes}"`,
          }
        }
        return item
      })
    )

    try {
      if (backendOnline) {
        await apiDelegateThread(emailId, notes)
      }
    } catch (err) {
      console.error('[API] Failed to delegate thread on server', err)
    }
  }

  // Assistant Resolves / Clears Takeover Alert (Synced to Backend)
  const handleResolveTakeover = async (emailId: string) => {
    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === emailId) {
          return {
            ...item,
            takeoverRequested: false,
          }
        }
        return item
      })
    )

    try {
      if (backendOnline) {
        await apiResolveTakeover(emailId)
      }
    } catch (err) {
      console.error('[API] Failed to resolve takeover on server', err)
    }
  }

  const handleToggleActionItem = (actionId: string) => {
    if (!selectedEmail || !selectedEmail.aiAnalysis) return
    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === selectedEmail.id && item.aiAnalysis) {
          return {
            ...item,
            aiAnalysis: {
              ...item.aiAnalysis,
              actionItems: item.aiAnalysis.actionItems.map((act) =>
                act.id === actionId ? { ...act, completed: !act.completed } : act
              ),
            },
          }
        }
        return item
      })
    )
  }

  const handleUseDraft = (draftText: string) => {
    setActiveDraft(draftText)
  }

  // Requirement: Send Reply & Append Message (Synced to Backend)
  const handleSendReply = async (emailId: string, replyBody: string) => {
    const target = emails.find((e) => e.id === emailId)
    if (!target) return

    const newReplyMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        name: 'Alex Morgan Office',
        email: 'assistant@mailpilot.ai',
      },
      recipients: [target.sender],
      timestamp: 'Just now',
      body: replyBody,
    }

    setEmails((prev) =>
      prev.map((item) => {
        if (item.id === emailId) {
          return {
            ...item,
            messages: [...item.messages, newReplyMessage],
            replyResponsibility: 'none',
            takeoverRequested: false,
          }
        }
        return item
      })
    )
    setActiveDraft('')

    try {
      if (backendOnline) {
        await apiReplyToThread(emailId, replyBody)
      }
    } catch (err) {
      console.error('[API] Failed to send reply to server', err)
    }
  }

  // Phase 4 Requirement: Live Gemini AI Analysis Trigger
  const handleTriggerLiveAnalysis = async () => {
    if (!selectedEmail) return
    setIsAiAnalyzing(true)
    setAiError(null)

    try {
      const result = await apiAnalyzeThreadWithGemini(selectedEmail.id)
      setEmails((prev) =>
        prev.map((item) => (item.id === selectedEmail.id ? result.data : item))
      )
    } catch (err: any) {
      // Requirement 3: Do not silently substitute hardcoded fake responses.
      // Display clear transparent error indicator.
      setAiError(err.message || 'Gemini API analysis failed.')
    } finally {
      setIsAiAnalyzing(false)
    }
  }

  const handleComposeSend = (data: {
    to: string
    subject: string
    body: string
    priority: PriorityLevel
  }) => {
    const newThread: Email = {
      id: `thread-${Date.now()}`,
      folder: 'sent',
      category: 'work',
      subject: data.subject,
      preview: data.body.slice(0, 100),
      timestamp: 'Just now',
      isRead: true,
      isStarred: false,
      isArchived: false,
      priority: data.priority,
      labels: ['Outgoing'],
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: {
            name: 'Alex Morgan',
            email: 'alex.morgan@mailpilot.ai',
          },
          recipients: [{ name: data.to.split('@')[0], email: data.to }],
          timestamp: 'Just now',
          body: data.body,
        },
      ],
      sender: {
        name: 'Alex Morgan',
        email: 'alex.morgan@mailpilot.ai',
      },
      recipients: [{ name: data.to.split('@')[0], email: data.to }],
      body: data.body,
      replyResponsibility: 'none',
      classificationReason: 'Outgoing message sent by user.',
      confidenceScore: 1.0,
      requiresReview: false,
      isManuallyClassified: true,
      clientStatus: 'handled',
      takeoverRequested: false,
    }

    setEmails((prev) => [newThread, ...prev])
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      {/* Assistant Mode Sidebar */}
      {currentPersona === 'assistant' && (
        <Sidebar
          currentFolder={currentFolder}
          onSelectFolder={setCurrentFolder}
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          currentResponsibility={currentResponsibility}
          onSelectResponsibility={setCurrentResponsibility}
          unreadCount={unreadCount}
          starredCount={starredCount}
          takeoverCount={takeoverCount}
          reviewCount={reviewCount}
          clientCount={clientCount}
          assistantCount={assistantCount}
          onOpenCompose={() => setIsComposeOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with Persona Switcher */}
        <Header
          currentPersona={currentPersona}
          onChangePersona={setCurrentPersona}
          takeoverCount={takeoverCount}
          clientPendingCount={clientPendingCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          unreadOnly={unreadOnly}
          onToggleUnreadOnly={() => setUnreadOnly((prev) => !prev)}
          isSyncing={isSyncing}
          onSync={syncWithBackend}
          backendOnline={backendOnline}
          databaseStorage={databaseStorage}
        />

        {/* View Switch: Client Dashboard vs Assistant Dashboard */}
        {currentPersona === 'client' ? (
          <ClientDashboard
            emails={emails}
            onMarkAsHandled={handleMarkAsHandled}
            onDelegateToAssistant={handleDelegateToAssistant}
          />
        ) : (
          /* Assistant Dashboard */
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Global Takeover Alert Notification Banner for Assistant */}
            {takeoverCount > 0 && currentResponsibility !== 'takeover' && (
              <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-800 shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>
                    <strong>{takeoverCount} Client Takeover Request(s)</strong> waiting for your assistance.
                  </span>
                </div>
                <button
                  onClick={() => setCurrentResponsibility('takeover')}
                  className="font-bold underline hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Takeovers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 3-Pane Body: List + Thread Detail + Copilot */}
            <div className="flex-1 flex overflow-hidden">
              {/* Email List Column */}
              <div
                className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 bg-slate-50/50 flex flex-col shrink-0 overflow-hidden ${
                  selectedEmail ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* List Header */}
                <div className="p-3.5 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 capitalize flex items-center gap-2">
                      <span>
                        {currentResponsibility !== 'all'
                          ? currentResponsibility === 'takeover'
                            ? 'Takeover Requests'
                            : `${currentResponsibility} Queue`
                          : currentFolder}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {filteredEmails.length}
                      </span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {currentCategory === 'all' ? 'All categories' : `${currentCategory} category`}
                    </p>
                  </div>

                  {currentResponsibility !== 'all' && (
                    <button
                      onClick={() => setCurrentResponsibility('all')}
                      className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                    >
                      Clear Queue
                    </button>
                  )}
                </div>

                {/* Email Items Scrollable List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {filteredEmails.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-semibold text-slate-600">No emails found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Try changing the AI queue or folder filters.
                      </p>
                    </div>
                  ) : (
                    filteredEmails.map((email) => (
                      <EmailListItem
                        key={email.id}
                        email={email}
                        isSelected={selectedEmail?.id === email.id}
                        onSelect={handleSelectEmail}
                        onToggleStar={handleToggleStar}
                        onUpdateClassification={handleUpdateClassification}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Email Detail Column & Copilot Drawer */}
              <div
                className={`flex-1 flex flex-col lg:flex-row overflow-hidden bg-white ${
                  !selectedEmail ? 'hidden md:flex' : 'flex'
                }`}
              >
                {selectedEmail ? (
                  <>
                    {/* Thread Detail View */}
                    <div className="flex-1 flex flex-col min-w-0 h-full border-r border-slate-200/80 overflow-hidden">
                      <EmailDetail
                        email={selectedEmail}
                        onBack={() => setSelectedEmailId('')}
                        onToggleStar={handleToggleStar}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        onToggleRead={handleToggleRead}
                        onSendReply={handleSendReply}
                        onUpdateClassification={handleUpdateClassification}
                        onResolveTakeover={handleResolveTakeover}
                        initialReplyDraft={activeDraft}
                      />
                    </div>

                    {/* Copilot Intelligence Drawer */}
                    <div className="w-full lg:w-96 bg-white overflow-y-auto p-4 md:p-6 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200/80">
                      <AICopilotPanel
                        analysis={selectedEmail.aiAnalysis}
                        onSelectReply={handleUseDraft}
                        onToggleActionItem={handleToggleActionItem}
                        onTriggerLiveAnalysis={handleTriggerLiveAnalysis}
                        isAnalyzing={isAiAnalyzing}
                        aiError={aiError}
                        geminiConfigured={geminiConfigured}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center bg-slate-50/30">
                    <div className="max-w-sm">
                      <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 border border-purple-100 shadow-2xs">
                        <Mail className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">
                        Select an Email Thread
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Choose a conversation from the assistant feed to manage classifications and draft replies.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleComposeSend}
      />
    </div>
  )
}
export default App
