import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from '../AdaptiveTrimmer/MaybeWithTooltip'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'

const WithTypographyAndLink: FC<{
  to: string
  mobile?: boolean
  children: ReactNode
}> = ({ children, to, mobile }) => {
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
      }}
    >
      <Link component={RouterLink} to={to}>
        {children}
      </Link>
    </Typography>
  )
}

interface Props {
  scope: SearchScope
  address: string

  /**
   * Should we always trim the text to a short line?
   */
  alwaysTrim?: boolean

  /**
   * Any extra tooltips to display
   *
   * (Besides the content necessary because of potential shortening)
   */
  extraTooltip?: ReactNode
}

export const AccountLink: FC<Props> = ({ scope, address, alwaysTrim, extraTooltip }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getAccountRoute(scope, address)

  const extraTooltipWithIcon = extraTooltip ? (
    <>
      <InfoIcon />
      {extraTooltip}
    </>
  ) : undefined

  // Are we in a table?
  if (alwaysTrim) {
    // In a table, we only ever want a short line

    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip title={address}>{trimLongString(address, 6, 6)}</MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Details in desktop mode.
    // We want one long line

    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip title={extraTooltipWithIcon}>{address} </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  // We need to show the data in details mode on mobile.
  // Line adaptively shortened to fill available space
  return (
    <WithTypographyAndLink to={to} mobile>
      <AdaptiveTrimmer text={address} strategy="middle" extraTooltip={extraTooltip} />
    </WithTypographyAndLink>
  )
}
