import { FC, ReactNode } from 'react'
import lightBackgroundEmptyState from './images/background-empty-state.svg'
import darkBackgroundEmptyState from './images/background-empty-state-dark.svg'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { CircleX } from 'lucide-react'

type EmptyStateProps = {
  description: ReactNode
  title: string
  light?: boolean
  minHeight?: number | string
}

export const EmptyState: FC<EmptyStateProps> = ({ description, title, light, minHeight = '360px' }) => {
  const content = (
    <div className={cn('text-center', light ? 'text-inherit' : 'text-white')}>
      <span className="block text-2xl font-medium">{title}</span>
      <span className="text-sm">{description}</span>
    </div>
  )
  return light ? (
    <div
      className="flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center h-full"
      style={{ backgroundImage: `url(${lightBackgroundEmptyState})`, minHeight }}
    >
      <CircleX size={32} className="text-destructive" />
      {content}
    </div>
  ) : (
    <div
      className="flex flex-col items-center justify-center bg-no-repeat bg-cover bg-center rounded-md text-white"
      style={{ backgroundImage: `url(${darkBackgroundEmptyState})`, minHeight }}
    >
      {content}
    </div>
  )
}
