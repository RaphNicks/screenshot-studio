import type { ReactNode } from 'react'

type BadgeVariant = 'accent' | 'gold' | 'subtle' | 'success'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  accent: 'bg-accent/10 text-accent-light border-accent/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  subtle: 'bg-white/5 text-text-secondary border-border',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const dotStyles: Record<BadgeVariant, string> = {
  accent: 'bg-accent',
  gold: 'bg-gold',
  subtle: 'bg-muted',
  success: 'bg-emerald-400',
}

export default function Badge({ children, variant = 'accent', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} animate-pulse-slow`} />
      )}
      {children}
    </span>
  )
}