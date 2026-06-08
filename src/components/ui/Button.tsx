import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent hover:bg-accent-light text-white shadow-glow-accent/40 hover:shadow-glow-accent border border-accent/40',
  secondary:
    'bg-white/5 hover:bg-white/10 text-text-primary border border-border hover:border-accent/40',
  ghost:
    'bg-transparent hover:bg-white/5 text-text-secondary hover:text-text-primary border border-transparent',
  gold:
    'bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:shadow-glow-gold',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-display font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}