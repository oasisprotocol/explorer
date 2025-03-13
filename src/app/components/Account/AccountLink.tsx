import { FC, ReactNode, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import InfoIcon from '@mui/icons-material/Info'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import Box from '@mui/material/Box'
import { HighlightedText } from '../HighlightedText'
import { AdaptiveHighlightedText } from '../HighlightedText/AdaptiveHighlightedText'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { AccountMetadataSourceIndicator } from './AccountMetadataSourceIndicator'
import { useAddressHighlighting } from '../HighlightingContext'
import { COLORS } from '../../../styles/theme/colors'

const WithHighlighting: FC<{ children: ReactNode; address: string }> = ({ children, address }) => {
  const { highlightedAddress, highlightAddress, releaseAddress } = useAddressHighlighting()
  useEffect(() => () => releaseAddress(address)) // Release address on umount
  const isHighlighted = !!highlightedAddress && highlightedAddress.toLowerCase() === address.toLowerCase()
  return (
    <Box
      onMouseEnter={() => highlightAddress(address)}
      onMouseLeave={() => releaseAddress(address)}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        padding: '4px 4px 2px 4px',
        ...(isHighlighted
          ? {
              background: COLORS.warningLight,
              border: `1px dashed ${COLORS.warningColor}`,
              borderRadius: '6px',
            }
          : {
              border: `1px dashed transparent`,
            }),
      }}
    >
      {children}
    </Box>
  )
}

const WithTypographyAndLink: FC<{
  scope: SearchScope
  address: string
  mobile?: boolean
  children: ReactNode
  labelOnly?: boolean
}> = ({ scope, address, children, mobile, labelOnly }) => {
  const to = RouteUtils.getAccountRoute(scope, address)
  return (
    <WithHighlighting address={address}>
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
    </WithHighlighting>
  )
}

interface Props {
  /**
   * Should only show the address, never a name
   *
   * (Use this in situations when the name is already on the screen for some reason.)
   */
  showOnlyAddress?: boolean
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
  showOnlyAddress,
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
  const showAccountName = !showOnlyAddress && !!accountName

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

  const tooltipTitle = (
    <div>
      {showAccountName && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ fontWeight: 'bold' }}>{accountName}</Box>
          <span>-</span>
          <AccountMetadataSourceIndicator source={accountMetadata!.source} withText />
        </Box>
      )}
      <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
      {extraTooltipWithIcon}
    </div>
  )

  // Are we in a situation when we should always trim?
  if (alwaysTrim || (alwaysTrimOnTablet && isTablet)) {
    // In a table, we only ever want a short line

    return (
      <WithTypographyAndLink scope={scope} address={address} labelOnly={labelOnly}>
        <MaybeWithTooltip title={tooltipTitle}>
          {showAccountName ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <AccountMetadataSourceIndicator source={accountMetadata!.source} />{' '}
              {trimLongString(accountName, 12, 0)}
            </Box>
          ) : (
            trimLongString(address, 6, 6)
          )}
        </MaybeWithTooltip>
      </WithTypographyAndLink>
    )
  }

  if (!isTablet) {
    // Details in desktop mode.
    // We want one long line, with name and address.

    return (
      <WithTypographyAndLink scope={scope} address={address} labelOnly={labelOnly}>
        <MaybeWithTooltip title={tooltipTitle}>
          {showAccountName ? (
            <Box sx={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
              <AccountMetadataSourceIndicator source={accountMetadata!.source} />
              <HighlightedText text={accountName} pattern={highlightedPartOfName} /> ({address})
            </Box>
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
    <WithTypographyAndLink scope={scope} address={address} mobile labelOnly={labelOnly}>
      <>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          {accountMetadata && <AccountMetadataSourceIndicator source={accountMetadata.source} />}
          <AdaptiveHighlightedText
            text={showAccountName ? accountName : ''}
            pattern={highlightedPartOfName}
            extraTooltip={tooltipTitle}
          />
        </Box>
        <AdaptiveTrimmer text={address} strategy="middle" tooltipOverride={tooltipTitle} />
      </>
    </WithTypographyAndLink>
  )
}
