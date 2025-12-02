import { FC } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Layers3 } from 'lucide-react'

export const MainnetIcon: FC<{ className?: string }> = ({ className }) => {
  return <Layers3 size={18} className={cn('stroke-current', className)} />
}
