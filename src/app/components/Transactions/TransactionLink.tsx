import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'

export const TransactionLink: FC<{ alwaysTrim?: boolean; scope: SearchScope; hash: string }> = ({
  alwaysTrim,
  hash,
  scope,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const to = RouteUtils.getTransactionRoute(scope, hash)

  return (
    <Typography variant="mono">
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={hash} to={to} />
      ) : (
        <Link component={RouterLink} to={to}>
          {hash}
        </Link>
      )}
    </Typography>
  )
}
