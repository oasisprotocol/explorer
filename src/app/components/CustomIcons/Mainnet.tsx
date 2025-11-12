import { FC } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export const MainnetIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={cn('fill-current w-6 h-6', className)} viewBox="0 0 24 24">
      <path d="M11.99 18.54L4.62 12.81L3 14.07L12 21.07L21 14.07L19.37 12.8L11.99 18.54V18.54ZM12 16L19.36 10.27L21 9L12 2L3 9L4.63 10.27L12 16Z" />
    </svg>
  )
}
