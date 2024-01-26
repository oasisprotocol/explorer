import MuiLinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { COLORS } from 'styles/theme/colors'

export const VerticalProgressBar = styled(MuiLinearProgress)(() => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.brandDark,
  },
  height: 36,
  width: 36,
  transform: 'rotate(-90deg)',
}))

export const ProgressBar = styled(MuiLinearProgress)(() => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.eucalyptus,
  },
  borderColor: COLORS.eucalyptus,
  backgroundColor: COLORS.honeydew,
  height: '12px',
  width: '85px',
}))
