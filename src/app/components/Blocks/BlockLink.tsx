import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { RouteUtils } from '../../utils/route-utils'
import { trimLongString } from '../../utils/trimLongString'
import { SearchScope } from '../../../types/searchScope'
import { useScreenSize } from '../../hooks/useScreensize'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

export const BlockLink: FC<{ scope: SearchScope; height: number }> = ({ scope, height }) => (
  <Link asChild className="font-medium">
    <RouterLink to={RouteUtils.getBlockRoute(scope, height)}>{height?.toLocaleString()}</RouterLink>
  </Link>
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
      <MaybeWithTooltip title={hash}>
        <Link asChild>
          <RouterLink to={to} className="text-primary font-medium">
            {trimLongString(hash)}
          </RouterLink>
        </Link>
      </MaybeWithTooltip>
    )
  }

  if (!isTablet) {
    // Desktop view
    return (
      <Link asChild className="font-medium">
        <RouterLink to={to}>{hash}</RouterLink>
      </Link>
    )
  }

  // Mobile view
  return (
    <span className="max-w-full overflow-x-hidden">
      <Link asChild>
        <RouterLink to={to} className="text-primary font-medium">
          <AdaptiveTrimmer text={hash} strategy="middle" minLength={13} />
        </RouterLink>
      </Link>
    </span>
  )
}
