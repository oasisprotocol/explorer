import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'

export const AccountLink: FC<{ scope: SearchScope; address: string; alwaysTrim?: boolean }> = ({
  scope,
  address,
  alwaysTrim,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const to = RouteUtils.getAccountRoute(scope, address)
  return (
    <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={address} to={to} />
      ) : (
        <Link component={RouterLink} to={to}>
          {address}
        </Link>
      )}
    </Typography>
  )
}
