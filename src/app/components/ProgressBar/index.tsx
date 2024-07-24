import { FC } from 'react'
import Box from '@mui/material/Box'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { COLORS } from 'styles/theme/colors'

type VerticalProgressBarProps = {
  value: number
  height?: number
  width?: number
  barWithBorder?: boolean
  barBackgroundColor?: string
}

const barSize = 36

export const VerticalProgressBar: FC<VerticalProgressBarProps> = ({
  value,
  height = barSize,
  width = barSize,
  barWithBorder = true,
  barBackgroundColor,
}) => {
  return (
    <Box sx={{ height: width, width: height, transform: 'rotate(-90deg)' }}>
      <StyledLinearProgress
        sx={{ height: width, width: height }}
        barWithBorder={barWithBorder}
        barBackgroundColor={barBackgroundColor}
        variant="determinate"
        value={value}
      />
    </Box>
  )
}
const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: prop => prop !== 'barWithBorder' && prop !== 'barBackgroundColor',
})<{ barWithBorder?: boolean; barBackgroundColor?: string }>(({ barWithBorder, barBackgroundColor }) => ({
  [`&.${linearProgressClasses.determinate} > .${linearProgressClasses.bar1Determinate}`]: {
    backgroundColor: COLORS.brandDark,
  },
  ...(!barWithBorder && { border: '0' }),
  ...(barBackgroundColor && { backgroundColor: barBackgroundColor }),
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
