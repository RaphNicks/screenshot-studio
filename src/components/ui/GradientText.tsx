import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  variant?: 'accent' | 'gold' | 'white'
}

const gradients = {
  accent: 'bg-gradient-to-r from-accent-light via-purple-300 to-accent bg-clip-text text-transparent',
  gold: 'bg-gradient-to-r from-yellow-300 via-gold to-amber-400 bg-clip-text text-transparent',
  white: 'bg-gradient-to-b from-white to-text-secondary bg-clip-text text-transparent',
}

export default function GradientText({ children, className = '', variant = 'accent' }: GradientTextProps) {
  return (
    <span className={`${gradients[variant]} ${className}`}>
      {children}
    </span>
  )
}