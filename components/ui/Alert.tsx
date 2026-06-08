import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'warning' | 'info' | 'error' | 'success'
  title?: string
}

export function Alert({ variant = 'info', title, children, className, ...props }: AlertProps) {
  const styles = {
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    info: 'bg-blue-50 border-blue-300 text-blue-900',
    error: 'bg-red-50 border-red-300 text-red-900',
    success: 'bg-green-50 border-green-300 text-green-900',
  }
  return (
    <div className={cn('border rounded p-4', styles[variant], className)} {...props}>
      {title && <p className="font-semibold text-sm mb-1">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  )
}
