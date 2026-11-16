import React from 'react'
import {
  Inbox,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Sparkles,
  Briefcase,
  Layers,
  Bell,
  Tag,
  PenSquare,
  Zap,
  User,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react'
import { EmailFolder, EmailCategory, ReplyResponsibility } from '../../types/email'
import { cn } from '../../utils/cn'

interface SidebarProps {
  currentFolder: EmailFolder
  onSelectFolder: (folder: EmailFolder) => void
  currentCategory: EmailCategory
  onSelectCategory: (category: EmailCategory) => void
  currentResponsibility: ReplyResponsibility | 'all' | 'takeover'
  onSelectResponsibility: (r: ReplyResponsibility | 'all' | 'takeover') => void
  unreadCount: number
  starredCount: number
  takeoverCount: number
  reviewCount: number
  clientCount: number
  assistantCount: number
  onOpenCompose: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentFolder,
  onSelectFolder,
  currentCategory,
  onSelectCategory,
  currentResponsibility,
  onSelectResponsibility,
  unreadCount,
  starredCount,
  takeoverCount,
  reviewCount,
  clientCount,
  assistantCount,
  onOpenCompose,
  isMobileOpen,
  onCloseMobile,
}) => {
  const folders = [
    { id: 'inbox' as EmailFolder, label: 'Inbox', icon: Inbox, badge: unreadCount },
    { id: 'starred' as EmailFolder, label: 'Starred', icon: Star, badge: starredCount },
    { id: 'sent' as EmailFolder, label: 'Sent', icon: Send },
    { id: 'drafts' as EmailFolder, label: 'Drafts', icon: FileText, badge: 2 },
    { id: 'archive' as EmailFolder, label: 'Archive', icon: Archive },
    { id: 'trash' as EmailFolder, label: 'Trash', icon: Trash2 },
  ]

  const responsibilityFilters: Array<{
    id: ReplyResponsibility | 'all' | 'takeover'
    label: string
    icon: React.ElementType
    badge?: number
    isAlert?: boolean
  }> = [
    { id: 'all', label: 'All Classifications', icon: Layers },
    {
      id: 'takeover',
      label: 'Takeover Requests',
      icon: AlertCircle,
      badge: takeoverCount,
      isAlert: true,
    },
    {
      id: 'assistant',
      label: 'Assistant to Reply',
      icon: Briefcase,
      badge: assistantCount,
    },
    {
      id: 'client',
      label: 'Client to Reply',
      icon: User,
      badge: clientCount,
    },
    {
      id: 'review',
      label: 'Needs Review',
      icon: AlertTriangle,
      badge: reviewCount,
    },
  ]

  const categories = [
    { id: 'all' as EmailCategory, label: 'All Mail', icon: Layers },
    { id: 'primary' as EmailCategory, label: 'Primary', icon: Sparkles },
    { id: 'work' as EmailCategory, label: 'Work', icon: Briefcase },
    { id: 'updates' as EmailCategory, label: 'Updates', icon: Bell },
    { id: 'newsletters' as EmailCategory, label: 'Newsletters', icon: Tag },
  ]

  const handleFolderClick = (folder: EmailFolder) => {
    onSelectFolder(folder)
    if (onCloseMobile) onCloseMobile()
  }

  const handleCategoryClick = (cat: EmailCategory) => {
    onSelectCategory(cat)
    if (onCloseMobile) onCloseMobile()
  }

  const handleRespClick = (r: ReplyResponsibility | 'all' | 'takeover') => {
    onSelectResponsibility(r)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shrink-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">MailPilot</span>
                <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Assistant Workspace</p>
            </div>
          </div>
        </div>

        {/* Compose Button */}
        <div className="p-3.5">
          <button
            onClick={onOpenCompose}
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-medium text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm shadow-purple-500/20 hover:shadow-md hover:shadow-purple-500/30 hover:opacity-95 transition-all duration-150 active:scale-[0.99]"
          >
            <PenSquare className="w-4 h-4" />
            <span>New Message</span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 space-y-5 scrollbar-thin">
          {/* 1. Reply Responsibility AI Triage Filters */}
          <div>
            <p className="px-3 text-[11px] font-bold tracking-wider text-purple-900/60 uppercase mb-1.5 flex items-center justify-between">
              <span>AI Triage Queue</span>
              <Sparkles className="w-3 h-3 text-purple-500" />
            </p>
            <nav className="space-y-0.5">
              {responsibilityFilters.map((item) => {
                const Icon = item.icon
                const isActive = currentResponsibility === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRespClick(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150',
                      isActive
                        ? item.isAlert
                          ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                          : 'bg-purple-50 text-purple-800 font-bold border border-purple-200/60'
                        : item.isAlert && item.badge && item.badge > 0
                        ? 'text-rose-700 hover:bg-rose-50 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={cn(
                          'w-3.5 h-3.5 shrink-0',
                          isActive
                            ? item.isAlert
                              ? 'text-rose-600'
                              : 'text-purple-600'
                            : item.isAlert && item.badge && item.badge > 0
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1',
                          item.isAlert
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isActive
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* 2. Main Mailboxes */}
          <div>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
              Folders
            </p>
            <nav className="space-y-0.5">
              {folders.map((item) => {
                const Icon = item.icon
                const isActive = currentFolder === item.id && currentResponsibility === 'all'
                return (
                  <button
                    key={item.id}
                    onClick={() => handleFolderClick(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'w-3.5 h-3.5',
                          isActive ? 'text-slate-800' : 'text-slate-400'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded-full font-semibold',
                          isActive
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* 3. Smart Categories */}
          <div>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
              Categories
            </p>
            <nav className="space-y-0.5">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = currentCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          'w-3.5 h-3.5',
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        )}
                      />
                      <span>{cat.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* AI Usage / Credits Footnote */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50/70 to-indigo-50/50 border border-purple-100/80">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                Gemini Copilot
              </span>
              <span className="text-[10px] text-purple-600 font-bold">Active</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Classification & thread intelligence enabled.
            </p>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Executive Assistant"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Assistant (Ops)</p>
            <p className="text-[10px] text-slate-400 truncate">assistant@mailpilot.ai</p>
          </div>
        </div>
      </aside>
    </>
  )
}
