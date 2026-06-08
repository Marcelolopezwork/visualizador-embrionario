import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded'
    const variants = {
      primary: 'bg-[#2D6A7F] text-white hover:bg-[#245a6c] focus:ring-[#2D6A7F]',
      secondary: 'border border-[#2D6A7F] text-[#2D6A7F] hover:bg-[#2D6A7F]/10 focus:ring-[#2D6A7F]',
      ghost: 'text-[#1C2B3A] hover:bg-[#FAF7F4] focus:ring-[#94A3B8]',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }
    const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
