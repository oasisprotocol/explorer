import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const VerticalList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: theme.palette.background.default,
}))
