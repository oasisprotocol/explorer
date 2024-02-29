import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import InfoIcon from '@mui/icons-material/Info'
import { useScreenSize } from '../../hooks/useScreensize'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { MaybeWithTooltip } from '../AdaptiveTrimmer/MaybeWithTooltip'
import { trimLongString } from '../../utils/trimLongString'
import Box from '@mui/material/Box'

const WithTypographyAndLink: FC<{ children: ReactNode; plain?: boolean; mobile?: boolean; to: string }> = ({
  children,
  plain,
  mobile,
  to,
}) => (
  <Typography
    variant="mono"
    component="span"
    sx={{
      ...(plain ? { color: COLORS.grayExtraDark, fontWeight: 400 } : {}),
      ...(mobile ? { maxWidth: '85%' } : {}),
    }}
  >
    {plain ? (
      children
    ) : (
      <Link component={RouterLink} to={to}>
        {children}
      </Link>
    )}
  </Typography>
)

export const TransactionLink: FC<{
  alwaysTrim?: boolean
  scope: SearchScope
  hash: string
  plain?: boolean
  extraTooltip?: ReactNode
}> = ({ alwaysTrim, hash, scope, plain, extraTooltip }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getTransactionRoute(scope, hash)
  const tooltipPostfix = extraTooltip ? (
    <Box sx={{ display: 'flex', alignContent: 'center', gap: 2 }}>
      <InfoIcon />
      {extraTooltip}
    </Box>
  ) : undefined

  if (alwaysTrim) {
    // Table mode
    return (
      <WithTypographyAndLink plain={plain} to={to}>
        <MaybeWithTooltip
          title={
            <Box>
              {hash}
              {tooltipPostfix}
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
      <WithTypographyAndLink plain={plain} to={to}>
        <MaybeWithTooltip title={tooltipPostfix}>{hash}</MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  // Mobile mode
  return (
    <WithTypographyAndLink mobile plain={plain} to={to}>
      <AdaptiveTrimmer text={hash} strategy="middle" extraTooltip={extraTooltip} />
    </WithTypographyAndLink>
  )
}
