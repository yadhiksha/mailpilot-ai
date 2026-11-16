import React from 'react'
import {
  Search,
  Menu,
  RotateCw,
  Database,
} from 'lucide-react'
import { PriorityLevel, UserPersona } from '../../types/email'
import { PersonaSwitcher } from './PersonaSwitcher'
import { cn } from '../../utils/cn'

interface HeaderProps {
  currentPersona: UserPersona
  onChangePersona: (p: UserPersona) => void
  takeoverCount: number
  clientPendingCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleMobileMenu: () => void
  priorityFilter: PriorityLevel | 'all'
  onPriorityFilterChange: (p: PriorityLevel | 'all') => void
  unreadOnly: boolean
  onToggleUnreadOnly: () => void
  isSyncing: boolean
  onSync: () => void
  backendOnline?: boolean
  databaseStorage?: string
}

export const Header: React.FC<HeaderProps> = ({
  currentPersona,
  onChangePersona,
  takeoverCount,
  clientPendingCount,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu,
  priorityFilter,
  onPriorityFilterChange,
  unreadOnly,
  onToggleUnreadOnly,
  isSyncing,
  onSync,
  backendOnline = false,
  databaseStorage = 'in-memory',
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search emails, topics, senders, AI analysis..."
            className="w-full pl-9 pr-12 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm text-slate-900 placeholder-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-150"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded-md">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Center: Persona Switcher */}
      <div className="flex items-center justify-center shrink-0">
        <PersonaSwitcher
          currentPersona={currentPersona}
          onChangePersona={onChangePersona}
          takeoverCount={takeoverCount}
          clientPendingCount={clientPendingCount}
        />
      </div>

      {/* Right Quick Controls & Live Backend Status Pill */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Backend & DB Status Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
          title={`Backend: ${backendOnline ? 'Connected' : 'Offline'} | Storage: ${databaseStorage}`}
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            )}
          />
          <Database className="w-3 h-3 text-slate-400" />
          <span>{databaseStorage.includes('mongo') ? 'MongoDB' : 'In-Memory (Temp)'}</span>
        </div>

        {/* Unread toggle pill (Assistant mode) */}
        {currentPersona === 'assistant' && (
          <button
            onClick={onToggleUnreadOnly}
            className={cn(
              'hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              unreadOnly
                ? 'bg-purple-50 text-purple-700 border-purple-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                unreadOnly ? 'bg-purple-600' : 'bg-slate-300'
              )}
            />
            Unread
          </button>
        )}

        {/* Priority quick filter */}
        {currentPersona === 'assistant' && (
          <div className="hidden xl:flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => onPriorityFilterChange('all')}
              className={cn(
                'px-2 py-1 rounded-md font-medium transition-colors',
                priorityFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              All
            </button>
            <button
              onClick={() => onPriorityFilterChange('urgent')}
              className={cn(
                'px-2 py-1 rounded-md font-medium transition-colors',
                priorityFilter === 'urgent'
                  ? 'bg-rose-50 text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-rose-600'
              )}
            >
              Urgent
            </button>
          </div>
        )}

        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-slate-200/80 transition-colors"
          title="Sync with backend & refresh"
        >
          <RotateCw className={cn('w-4 h-4', isSyncing && 'animate-spin text-purple-600')} />
        </button>
      </div>
    </header>
  )
}
