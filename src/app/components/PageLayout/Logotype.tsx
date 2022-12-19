import { Link as RouterLink } from 'react-router-dom'
import logotype from './images/logo.svg'
import { AppTypography } from '../AppTypography/AppTypography'
import { AppLink } from '../AppLink/AppLink'

export function Logotype() {
  return (
    <AppLink
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
      <AppTypography variant="h1">Oasis Blockchain Explorer</AppTypography>
    </AppLink>
  )
}
