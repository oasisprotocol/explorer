import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

type CircleProps = BoxProps & { color: string; size: number }

export const Circle = styled(Box)<CircleProps>(({ color, size, theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing(size),
  minWidth: theme.spacing(size),
  height: theme.spacing(size),
  backgroundColor: color,
  borderRadius: theme.spacing(size),
}))
