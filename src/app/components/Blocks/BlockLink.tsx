import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import { trimLongString } from '../../utils/trimLongString'
import { SearchScope } from '../../../types/searchScope'
import { useScreenSize } from '../../hooks/useScreensize'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'

export const BlockLink: FC<{ scope: SearchScope; height: number }> = ({ scope, height }) => (
  <Typography variant="mono">
    <Link component={RouterLink} to={RouteUtils.getBlockRoute(scope, height)}>
      {height?.toLocaleString()}
    </Link>
  </Typography>
)

export const BlockHashLink: FC<{
  scope: SearchScope
  hash: string
  height: number
  alwaysTrim?: boolean
}> = ({ scope, hash, height, alwaysTrim }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getBlockRoute(scope, height)

  if (alwaysTrim) {
    // Table view
    return (
      <Typography variant="mono">
        <MaybeWithTooltip title={hash}>
          <Link component={RouterLink} to={to}>
            {trimLongString(hash)}
          </Link>
        </MaybeWithTooltip>
      </Typography>
    )
  }

  if (!isTablet) {
    // Desktop view
    return (
      <Typography variant="mono">
        <Link component={RouterLink} to={to}>
          {hash}
        </Link>
      </Typography>
    )
  }

  // Mobile view
  return (
    <Typography variant="mono" sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <Link component={RouterLink} to={to}>
        <AdaptiveTrimmer text={hash} strategy="middle" />
      </Link>
    </Typography>
  )
}
