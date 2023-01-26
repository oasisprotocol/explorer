import { FC, memo } from 'react'
import { Chip } from '@mui/material'
import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'

interface PercentageGainProps {
  /**
   * Positive percentage shows green box with up arrow
   * Negative percentage shows red box with down arrow
   */
  percentage: number
}

const PercentageGainCmp: FC<PercentageGainProps> = ({ percentage }) => {
  const gain = percentage >= 0

  return (
    <Chip
      color={gain ? 'success' : 'error'}
      icon={gain ? <NorthIcon sx={{ fontSize: '14px' }} /> : <SouthIcon sx={{ fontSize: '14px' }} />}
      label={`${percentage}%`}
    />
  )
}

export const PercentageGain = memo(PercentageGainCmp)
