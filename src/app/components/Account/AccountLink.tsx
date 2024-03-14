import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from '../AdaptiveTrimmer/MaybeWithTooltip'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'

const WithTypographyAndLink: FC<{
  to: string
  plain?: boolean
  mobile?: boolean
  children: ReactNode
}> = ({ children, to, plain, mobile }) => {
  return (
    <Typography
      variant="mono"
      component="span"
      sx={{
        ...(mobile
          ? {
              maxWidth: '100%',
              overflowX: 'hidden',
            }
          : {}),
        ...(plain
          ? { color: COLORS.grayExtraDark, fontWeight: 400 }
          : { color: COLORS.brandDark, fontWeight: 700 }),
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
}

export const AccountLink: FC<{
  scope: SearchScope
  address: string

  /**
   * Should we always trim the text to a short line?
   */
  alwaysTrim?: boolean

  /**
   * Plain mode? (No link required)
   */
  plain?: boolean

  /**
   * Any extra tooltips to display
   *
   * (Besides the content necessary because of potential shortening)
   */
  extraTooltip?: ReactNode
}> = ({ scope, address, alwaysTrim, plain, extraTooltip }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getAccountRoute(scope, address)

  const tooltipPostfix = extraTooltip ? (
    <>
      <InfoIcon />
      {extraTooltip}
    </>
  ) : undefined

  // Are we in a table?
  if (alwaysTrim) {
    // In a table, we only ever want one short line

    return (
      <WithTypographyAndLink to={to} plain={plain}>
        <MaybeWithTooltip title={address}>{trimLongString(address, 6, 6)}</MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Details in desktop mode.
    // We want one long line, with name and address.

    return (
      <WithTypographyAndLink to={to} plain={plain}>
        <MaybeWithTooltip title={tooltipPostfix}>{address} </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  // We need to show the data in details mode on mobile.
  // We want two lines, one for name (if available), one for address
  // Both line adaptively shortened to fill available space
  return (
    <WithTypographyAndLink to={to} plain={plain} mobile>
      <AdaptiveTrimmer text={address} strategy="middle" extraTooltip={extraTooltip} />
    </WithTypographyAndLink>
  )
}
