import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import logotype from './images/logo.svg'

export function Logotype() {
  return (
    <Link
      to="/"
      component={RouterLink}
      sx={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <img src={logotype} alt="logo" height={40} width={40} />
      <Typography variant="h1">Oasis Blockchain Explorer</Typography>
    </Link>
  )
}
