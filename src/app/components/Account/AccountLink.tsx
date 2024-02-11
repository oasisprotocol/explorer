import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { useAccountName } from '../../hooks/useAccountName'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from '../AdaptiveTrimmer/MaybeWithTooltip'
import Box from '@mui/material/Box'
import { HighlightedText } from '../HighlightedText'
import { AdaptiveHighlightedText } from '../HighlightedText/AdaptiveHighlightedText'
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
              overflow: 'hidden',
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
   * What part of the name should be highlighted (if any)
   */
  highlightedPartOfName?: string | undefined

  /**
   * Any extra tooltips to display
   *
   * (Besides the content necessary because of potential shortening)
   */
  extraTooltip?: ReactNode
}

export const AccountLink: FC<Props> = ({
  scope,
  address,
  alwaysTrim,
  highlightedPartOfName,
  extraTooltip,
}) => {
  const { isTablet } = useScreenSize()
  const { name: accountName } = useAccountName(scope, address)
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
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip
          title={
            accountName ? (
              <div>
                <Box sx={{ fontWeight: 'bold' }}>{accountName}</Box>
                <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
                {tooltipPostfix}
              </div>
            ) : (
              address
            )
          }
        >
          {accountName ? trimLongString(accountName, 12, 0) : trimLongString(address, 6, 6)}
        </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Details in desktop mode.
    // We want one long line, with name and address.

    return (
      <WithTypographyAndLink to={to}>
        <MaybeWithTooltip title={tooltipPostfix}>
          {accountName ? (
            <span>
              <HighlightedText text={accountName} pattern={highlightedPartOfName} /> ({address})
            </span>
          ) : (
            address
          )}
        </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  // We need to show the data in details mode on mobile.
  // We want two lines, one for name (if available), one for address
  // Both line adaptively shortened to fill available space
  return (
    <WithTypographyAndLink to={to} mobile>
      <>
        <AdaptiveHighlightedText
          text={accountName}
          pattern={highlightedPartOfName}
          extraTooltip={extraTooltip}
        />
        <AdaptiveTrimmer text={address} strategy="middle" extraTooltip={extraTooltip} />
      </>
    </WithTypographyAndLink>
  )
}
