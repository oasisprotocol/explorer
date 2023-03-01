import { FC } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { Layer } from '../../../oasis-indexer/api'

export const AccountLink: FC<{ address: string }> = ({ address }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { layer } = useParams()
  const to = RouteUtils.getAccountRoute(address, layer)
  return isMobile ? (
    <TrimLinkLabel label={address} to={to} />
  ) : (
    <Link component={RouterLink} to={to}>
      {address}
    </Link>
  )
}
