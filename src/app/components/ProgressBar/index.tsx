import { FC, ReactNode } from 'react'
import { Progress } from '@oasisprotocol/ui-library/src/components/progress'

type CustomProgressProps = {
  value?: number
  max?: number
  label: ReactNode
}

export const CustomProgress: FC<CustomProgressProps> = ({ value, max, label }) => {
  if (!value || !max) {
    return null
  }

  return (
    <div className="w-full relative">
      <Progress value={(value / max) * 100} className="h-8 bg-muted-foreground rounded-[8px]" />
      <span className="absolute inset-y-0 left-3 flex items-center text-white text-xs font-normal">
        {label}
      </span>
    </div>
  )
}
