import { FC } from 'react'
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
  alwaysTrim?: boolean
  plain?: boolean
}> = ({ scope, address, alwaysTrim, plain }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getAccountRoute(scope, address)
  return (
    <Typography variant="mono" component="span">
      {alwaysTrim || isTablet ? (
        <TrimLinkLabel label={address} to={to} plain={plain} />
      ) : (
        <Link component={RouterLink} to={to} sx={{ fontWeight: plain ? 400 : undefined }}>
          {address}
        </Link>
      )}
    </Typography>
  )
}
