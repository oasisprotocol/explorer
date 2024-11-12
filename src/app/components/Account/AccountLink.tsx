import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
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
  labelOnly?: boolean
}> = ({ children, to, mobile, labelOnly }) => {
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
      {labelOnly ? (
        children
      ) : (
        <Link component={RouterLink} to={to}>
          {children}
        </Link>
      )}
    </Typography>
  )
}

interface Props {
  showAddressAsName?: boolean
  scope: SearchScope
  address: string

  /**
   * Should we always trim the text to a short line?
   */
  alwaysTrim?: boolean

  /**
   * Should we always trim the text to a short line when on mobile or Tablet?
   */
  alwaysTrimOnTablet?: boolean

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

  /**
   * Should we display this as a simple label, with no link?
   *
   * (Used for own address)
   */
  labelOnly?: boolean
}

export const AccountLink: FC<Props> = ({
  showAddressAsName,
  scope,
  address,
  alwaysTrim,
  alwaysTrimOnTablet,
  highlightedPartOfName,
  extraTooltip,
  labelOnly,
}) => {
  const { isTablet } = useScreenSize()
  const {
    metadata: accountMetadata,
    // isError, // Use this to indicate that we have failed to load the name for this account
  } = useAccountMetadata(scope, address)
  const accountName = accountMetadata?.name // TODO: we should also use the description
  const showAccountName = !showAddressAsName && accountName
  const to = RouteUtils.getAccountRoute(scope, address)

  const extraTooltipWithIcon = extraTooltip ? (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        gap: 2,
      }}
    >
      <InfoIcon />
      {extraTooltip}
    </Box>
  ) : undefined

  // Are we in a situation when we should always trim?
  if (alwaysTrim || (alwaysTrimOnTablet && isTablet)) {
    // In a table, we only ever want a short line

    return (
      <WithTypographyAndLink to={to} labelOnly={labelOnly}>
        <MaybeWithTooltip
          title={
            <div>
              {showAccountName && <Box sx={{ fontWeight: 'bold' }}>{accountName}</Box>}
              <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
              {extraTooltipWithIcon}
            </div>
          }
        >
          {showAccountName ? trimLongString(accountName, 12, 0) : trimLongString(address, 6, 6)}
        </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Details in desktop mode.
    // We want one long line, with name and address.

    return (
      <WithTypographyAndLink to={to} labelOnly={labelOnly}>
        <MaybeWithTooltip title={extraTooltipWithIcon}>
          {showAccountName ? (
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
  // Both lines adaptively shortened to fill available space
  return (
    <WithTypographyAndLink to={to} mobile labelOnly={labelOnly}>
      <>
        <AdaptiveHighlightedText
          text={showAccountName ? accountName : ''}
          pattern={highlightedPartOfName}
          extraTooltip={extraTooltip}
        />
        <AdaptiveTrimmer text={address} strategy="middle" extraTooltip={extraTooltip} />
      </>
    </WithTypographyAndLink>
  )
}
