import { FC, ReactNode } from 'react'
import { Progress } from '@oasisprotocol/ui-library/src/components/progress'
import { calculatePercentage } from '../../utils/number-utils'

type LabeledProgresssProps = {
  value?: number | string
  max?: number | string
  label: ReactNode
}

export const LabeledProgress: FC<LabeledProgresssProps> = ({ value, max, label }) => {
  const percentage = calculatePercentage(value, max)

  if (percentage === null) {
    return null
  }

  return (
    <div className="w-full relative">
      <Progress value={percentage} className="h-8 bg-muted-foreground rounded-[8px]" />
      <span className="absolute inset-y-0 left-3 flex items-center text-white text-xs font-normal">
        {label}
      </span>
    </div>
  )
}
