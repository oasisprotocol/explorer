import { FC } from 'react'
import Box from '@mui/material/Box'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { COLORS } from 'styles/theme/colors'

type VerticalProgressBarProps = {
  value: number
}

const barSize = 36

export const VerticalProgressBar: FC<VerticalProgressBarProps> = ({ value }) => {
  return (
    <Box sx={{ width: barSize, height: barSize, transform: 'rotate(-90deg)' }}>
      <StyledLinearProgress variant="determinate" value={value} />
    </Box>
  )
}

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.brandDark,
  },
  height: barSize,
  width: barSize,
}))

export const ProgressBar = styled(LinearProgress)(() => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.eucalyptus,
  },
  borderColor: COLORS.eucalyptus,
  backgroundColor: COLORS.honeydew,
  height: '12px',
  width: '85px',
}))

export const BrandProgressBar = styled(LinearProgress)(() => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.brandDark,
  },
  borderColor: COLORS.grayLight,
  backgroundColor: COLORS.grayLight,
  height: '12px',
}))
