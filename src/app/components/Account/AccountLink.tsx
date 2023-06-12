import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'

export const AccountLink: FC<{
  scope: SearchScope
  address: string
  alwaysTrim?: boolean
  plain?: boolean
}> = ({ scope, address, alwaysTrim, plain }) => {
  const { isMobile } = useScreenSize()
  const to = RouteUtils.getAccountRoute(scope, address)
  return (
    <Typography
      variant="mono"
      component="span"
      sx={
        plain
          ? { color: COLORS.grayExtraDark, fontWeight: 400 }
          : { color: COLORS.brandDark, fontWeight: 700 }
      }
    >
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={address} to={to} />
      ) : plain ? (
        address
      ) : (
        <Link component={RouterLink} to={to}>
          {address}
        </Link>
      )}
    </Typography>
  )
}
