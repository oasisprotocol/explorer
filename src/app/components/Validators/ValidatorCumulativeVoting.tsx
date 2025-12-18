import { FC } from 'react'
import { PercentageValue } from '../PercentageValue'
import { calculatePercentage } from '../../utils/number-utils'

type ValidatorCumulativeVotingProps = {
  containerMarginThemeSpacing: number
  value: number | string | undefined
  total: number | string | undefined
}

export const ValidatorCumulativeVoting: FC<ValidatorCumulativeVotingProps> = ({
  containerMarginThemeSpacing,
  value,
  total,
}) => {
  const percentage = calculatePercentage(value, total)

  if (percentage === null) {
    return null
  }

  return (
    <div className="flex-1 relative text-center">
      <div
        className="absolute left-0 top-0 border-r-5 rounded-sm border-primary bg-blue-100"
        style={{
          width: `${percentage}%`,
          height: `calc(100% + ${containerMarginThemeSpacing * 8}px)`,
          top: `-${containerMarginThemeSpacing * 4}px`,
        }}
      />
      <span className="relative z-10">
        <PercentageValue value={value} total={total} />
      </span>
    </div>
  )
}
