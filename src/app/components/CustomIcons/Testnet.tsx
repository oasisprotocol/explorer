import { FC } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { FlaskConical } from 'lucide-react'

export const TestnetIcon: FC<{ className?: string }> = ({ className }) => {
  return <FlaskConical size={18} className={cn('stroke-current', className)} />
}
