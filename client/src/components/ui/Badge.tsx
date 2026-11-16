import React from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'accent' | 'neutral' | 'urgent' | 'high' | 'medium' | 'low' | 'success'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
  ...props
}) => {
  const variantStyles = {
    brand: 'bg-purple-50 text-purple-700 border-purple-200/70',
    accent: 'bg-blue-50 text-blue-700 border-blue-200/70',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    urgent: 'bg-rose-50 text-rose-700 border-rose-200/80',
    high: 'bg-amber-50 text-amber-700 border-amber-200/80',
    medium: 'bg-blue-50 text-blue-700 border-blue-200/70',
    low: 'bg-slate-50 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  }

  const dotStyles = {
    brand: 'bg-purple-500',
    accent: 'bg-blue-500',
    neutral: 'bg-slate-400',
    urgent: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-blue-500',
    low: 'bg-slate-400',
    success: 'bg-emerald-500',
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  )
}
