import { FC, memo } from 'react'
import Box from '@mui/material/Box'
import ArrowIcon from '../../icons/ArrowIcon'
import { styled } from '@mui/material/styles'
import { Gain, GainToArrowDirectionMap } from './types'
import { PercentageGainUtils } from './percentage-gain-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

interface PercentageGainProps {
  /**
   * Positive percentage shows green box with up arrow
   * Negative percentage shows red box with down arrow
   */
  percentage: number;
}

const PercentageGainBox = styled(Box)<{ gain: Gain }>(({ gain, theme }) => ({
  borderRadius: '9px',
  padding: '7px 10px 6px',
  display: 'flex',
  gap: '2px',
  justifyContent: 'center',
  alignItems: 'center',
  ...(gain === Gain.POSITIVE ? {
    backgroundColor: theme.palette.success.main
  } : {
    backgroundColor: theme.palette.error.main
  }),
  color: COLORS.white
}));

const PercentageGainLabel = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '15px',
  lineHeight: '18px'
}))

const PercentageGain: FC<PercentageGainProps> = ({ percentage }) => {
  const gain = PercentageGainUtils.getGainFromPercentage(percentage);

  return (
    <PercentageGainBox gain={gain}>
      <ArrowIcon arrowDirection={GainToArrowDirectionMap[gain]} />
      <PercentageGainLabel>{percentage}%</PercentageGainLabel>
    </PercentageGainBox>
  )
}

export default memo(PercentageGain)
