import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

export const VerticalProgressBar = styled(LinearProgress)(() => ({
  height: 36,
  width: 36,
  transform: 'rotate(-90deg)',
}))
