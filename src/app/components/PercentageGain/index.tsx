import { FC, memo } from 'react'
import ArrowIcon from '../../icons/ArrowIcon'
import { styled } from '@mui/material/styles'
import { GainToArrowDirectionMap } from './types'
import { PercentageGainUtils } from './percentage-gain-utils'
import { Chip } from '@mui/material'

interface PercentageGainProps {
  /**
   * Positive percentage shows green box with up arrow
   * Negative percentage shows red box with down arrow
   */
  percentage: number;
}

const PercentageGainChip = styled(Chip)(({ theme }) => ({
  borderRadius: '9px',
  padding: theme.spacing(3),
  gap: '2px',
  span: {
    padding: 0
  }
}))

const PercentageGainCmp: FC<PercentageGainProps> = ({ percentage }) => {
  const gain = PercentageGainUtils.getGainFromPercentage(percentage)

  return (
    <PercentageGainChip color={PercentageGainUtils.getColorFromGain(gain)}
                        icon={<ArrowIcon arrowDirection={GainToArrowDirectionMap[gain]} />} label={`${percentage}%`} />
  )
}

export const PercentageGain = memo(PercentageGainCmp)
