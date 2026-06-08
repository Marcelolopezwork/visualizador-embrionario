import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { EmbryoStatus } from '@/lib/types'

const statusColors: Record<EmbryoStatus, string> = {
  criopreservado: 'bg-blue-100 text-blue-800',
  transferido: 'bg-green-100 text-green-800',
  detenido: 'bg-gray-100 text-gray-600',
  no_viable: 'bg-red-100 text-red-700',
  pendiente: 'bg-yellow-100 text-yellow-800',
  NGS: 'bg-purple-100 text-purple-800',
}

const statusLabels: Record<EmbryoStatus, string> = {
  criopreservado: 'Criopreservado',
  transferido: 'Transferido',
  detenido: 'Detenido',
  no_viable: 'No viable',
  pendiente: 'Pendiente',
  NGS: 'NGS',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: EmbryoStatus
}

export function StatusBadge({ status, className, ...props }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', statusColors[status], className)} {...props}>
      {statusLabels[status]}
    </span>
  )
}

export function Badge({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700', className)} {...props}>
      {children}
    </span>
  )
}
