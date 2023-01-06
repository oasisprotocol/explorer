import { FC, PropsWithChildren } from 'react'
import Link from '@mui/material/Link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

import logotype from './images/logo.svg'

export const Logotype: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const logoSize = isMobile ? 32 : 40

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
      <>
        <img src={logotype} alt="logo" height={logoSize} width={logoSize} />
        {!isMobile && children}
      </>
    </Link>
  )
}
