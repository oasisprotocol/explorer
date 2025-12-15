import { FC, ReactNode } from 'react'
import { Progress } from '@oasisprotocol/ui-library/src/components/progress'
import BigNumber from 'bignumber.js'

type LabeledProgresssProps = {
  value?: number | string
  max?: number | string
  label: ReactNode
}

export const LabeledProgress: FC<LabeledProgresssProps> = ({ value, max, label }) => {
  if (!value || !max) {
    return null
  }

  const progressValue = new BigNumber(value)
  const progressMax = new BigNumber(max)

  if (!progressValue || !progressMax || progressMax.lte(0)) {
    return null
  }

  const percentage = progressValue.div(progressMax).multipliedBy(100).toNumber()

  return (
    <div className="w-full relative">
      <Progress value={percentage} className="h-8 bg-muted-foreground rounded-[8px]" />
      <span className="absolute inset-y-0 left-3 flex items-center text-white text-xs font-normal">
        {label}
      </span>
    </div>
  )
}
