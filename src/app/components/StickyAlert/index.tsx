import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

export const StickyAlert = styled(Alert)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  justifyContent: 'center',
  borderRadius: 0,
  fontSize: '14px',
  lineHeight: '18px',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4, 0),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3, 0),
  },
}))
