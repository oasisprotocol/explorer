import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'
import { useScreenSize } from '../../hooks/useScreensize'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { trimLongString } from '../../utils/trimLongString'
import Box from '@mui/material/Box'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

const WithTypographyAndLink: FC<{ children: ReactNode; mobile?: boolean; to: string }> = ({
  children,
  mobile,
  to,
}) => (
  <Link asChild className={cn('font-medium', mobile && 'max-w-[85%]')}>
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
    <Box sx={{ display: 'flex', alignContent: 'center', gap: 2 }}>
      <InfoIcon />
      {extraTooltip}
    </Box>
  ) : undefined

  if (alwaysTrim) {
    // Table mode
    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip
          title={
            <Box>
              {hash}
              {extraToolTipWithIcon}
            </Box>
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
