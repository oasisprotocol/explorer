import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import InfoIcon from '@mui/icons-material/Info'
import { useScreenSize } from '../../hooks/useScreensize'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { trimLongString } from '../../utils/trimLongString'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

const WithTypographyAndLink: FC<{ children: ReactNode; mobile?: boolean; to: string }> = ({
  children,
  mobile,
  to,
}) => (
  <Link asChild className={cn('font-mono font-medium', mobile && 'max-w-[85%]')}>
    <RouterLink to={to}>{children}</RouterLink>
  </Link>
)

export const TransactionLink: FC<{
  alwaysTrim?: boolean
  scope: SearchScope
  hash: string
  extraTooltip?: ReactNode
}> = ({ alwaysTrim, hash, scope, extraTooltip }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getTransactionRoute(scope, hash)
  const extraToolTipWithIcon = extraTooltip ? (
    <div className="inline-flex items-center gap-2">
      <InfoIcon />
      {extraTooltip}
    </div>
  ) : undefined

  if (alwaysTrim) {
    // Table mode
    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip
          title={
            <div>
              {hash}
              {extraToolTipWithIcon}
            </div>
          }
        >
          {trimLongString(hash, 6, 6)}
        </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Desktop mode
    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip title={extraToolTipWithIcon}>{hash}</MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  // Mobile mode
  return (
    <WithTypographyAndLink mobile to={to}>
      <AdaptiveTrimmer text={hash} strategy="middle" extraTooltip={extraTooltip} minLength={13} />
    </WithTypographyAndLink>
  )
}
