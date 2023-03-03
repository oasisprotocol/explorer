import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { Layer } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'

export const AccountLink: FC<{ address: string; paratime: Layer }> = ({ address, paratime }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const to = RouteUtils.getAccountRoute(address, paratime)
  return isMobile ? (
    <TrimLinkLabel label={address} to={to} />
  ) : (
    <Link component={RouterLink} to={to}>
      {address}
    </Link>
  )
}
