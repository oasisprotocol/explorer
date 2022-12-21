import { FC, memo } from 'react'
import ArrowIcon from '../../icons/ArrowIcon'
import { Gain, GainToArrowDirectionMap } from './types'
import { getGainFromPercentage } from './percentage-gain-utils'
import { Chip } from '@mui/material'

interface PercentageGainProps {
  /**
   * Positive percentage shows green box with up arrow
   * Negative percentage shows red box with down arrow
   */
  percentage: number;
}

const PercentageGainCmp: FC<PercentageGainProps> = ({ percentage }) => {
  const gain = getGainFromPercentage(percentage)

  return (
    <Chip color={gain === Gain.POSITIVE ? 'success' : 'error'}
                        icon={<ArrowIcon arrowDirection={GainToArrowDirectionMap[gain]} />} label={`${percentage}%`} />
  )
}

export const PercentageGain = memo(PercentageGainCmp)
