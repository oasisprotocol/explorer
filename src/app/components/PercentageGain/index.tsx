import { FC } from 'react'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

interface PercentageGainProps {
  earliestValue: number
  latestValue: number
}

export const PercentageGain: FC<PercentageGainProps> = ({ earliestValue, latestValue }) => {
  // If the previous data was zero, we can't divide with it, it would just get us infinity or Nan...
  if (earliestValue === 0) return

  const ratio = (latestValue - earliestValue) / earliestValue
  const isSuccess = ratio >= 0

  return (
    <Badge variant={isSuccess ? 'success' : 'error'}>
      {new Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: 2,
        signDisplay: 'always',
      }).format(ratio)}
    </Badge>
  )
}
