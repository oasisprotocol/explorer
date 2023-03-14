import { FC } from 'react'
import Chip from '@mui/material/Chip'
import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'

interface PercentageGainProps {
  earliestValue: number
  latestValue: number
}

/**
 * Positive percentage shows green box with up arrow.
 * Negative percentage shows red box with down arrow.
 */
export const PercentageGain: FC<PercentageGainProps> = ({ earliestValue, latestValue }) => {
  const ratio = (latestValue - earliestValue) / earliestValue

  return (
    <Chip
      color={ratio >= 0 ? 'success' : 'error'}
      icon={ratio >= 0 ? <NorthIcon sx={{ fontSize: '14px' }} /> : <SouthIcon sx={{ fontSize: '14px' }} />}
      label={new Intl.NumberFormat(undefined, {
        style: 'percent',
        maximumFractionDigits: 2,
        signDisplay: 'never',
      }).format(ratio)}
    />
  )
}
