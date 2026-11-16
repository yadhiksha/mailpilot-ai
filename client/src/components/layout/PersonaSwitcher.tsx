import React from 'react'
import { Briefcase, User, AlertCircle } from 'lucide-react'
import { UserPersona } from '../../types/email'
import { cn } from '../../utils/cn'

interface PersonaSwitcherProps {
  currentPersona: UserPersona
  onChangePersona: (persona: UserPersona) => void
  takeoverCount: number
  clientPendingCount: number
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  currentPersona,
  onChangePersona,
  takeoverCount,
  clientPendingCount,
}) => {
  return (
    <div className="flex items-center p-1 bg-slate-100/90 border border-slate-200/80 rounded-2xl shadow-2xs">
      {/* Assistant Persona Button */}
      <button
        type="button"
        onClick={() => onChangePersona('assistant')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none',
          currentPersona === 'assistant'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
            : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <Briefcase
          className={cn(
            'w-3.5 h-3.5',
            currentPersona === 'assistant' ? 'text-purple-600' : 'text-slate-400'
          )}
        />
        <span className="hidden sm:inline">Executive</span> Assistant
        {takeoverCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full animate-pulse shadow-xs">
            <AlertCircle className="w-2.5 h-2.5" />
            {takeoverCount}
          </span>
        )}
      </button>

      {/* Client Persona Button */}
      <button
        type="button"
        onClick={() => onChangePersona('client')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 select-none',
          currentPersona === 'client'
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/20'
            : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <User
          className={cn(
            'w-3.5 h-3.5',
            currentPersona === 'client' ? 'text-white' : 'text-slate-400'
          )}
        />
        <span>Client (Alex)</span>
        {clientPendingCount > 0 && (
          <span
            className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
              currentPersona === 'client'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 text-purple-700'
            )}
          >
            {clientPendingCount}
          </span>
        )}
      </button>
    </div>
  )
}
