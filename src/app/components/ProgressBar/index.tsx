import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { COLORS } from 'styles/theme/colors'
import { Progress } from '@oasisprotocol/ui-library/src/components/progress'

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

type CustomProgressProps = {
  value?: number
  max?: number
  label: ReactNode
}

export const CustomProgress: FC<CustomProgressProps> = ({ value, max, label }) => {
  if (!value || !max) {
    return null
  }

  return (
    <div className="w-full relative">
      <Progress value={(value / max) * 100} className="h-8 bg-muted-foreground rounded-[8px]" />
      <span className="absolute inset-y-0 left-3 flex items-center text-white text-xs font-normal">
        {label}
      </span>
    </div>
  )
}
