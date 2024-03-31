import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'

export const AccountLink: FC<{
  scope: SearchScope
  address: string
  title?: ReactNode
  alwaysTrim?: boolean
}> = ({ scope, address, title, alwaysTrim }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getAccountRoute(scope, address)

  return title ? (
    <Link component={RouterLink} to={to}>
      {title}
    </Link>
  ) : (
    <Typography variant="mono" component="span">
      {alwaysTrim || isTablet ? (
        <TrimLinkLabel label={address} to={to} />
      ) : (
        <Link component={RouterLink} to={to}>
          {address}
        </Link>
      )}
    </Typography>
  )
}
