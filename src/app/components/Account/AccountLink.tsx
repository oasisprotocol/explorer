import { FC, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'
import { useScreenSize } from '../../hooks/useScreensize'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RouteUtils } from '../../utils/route-utils'
import { Info } from 'lucide-react'
import { SearchScope } from '../../../types/searchScope'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import { trimLongString } from '../../utils/trimLongString'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { HighlightedText } from '../HighlightedText'
import { AdaptiveHighlightedText } from '../HighlightedText/AdaptiveHighlightedText'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { AccountMetadataSourceIndicator } from './AccountMetadataSourceIndicator'
import { WithHoverHighlighting } from '../HoverHighlightingContext/WithHoverHighlighting'

const WithTypographyAndLink: FC<{
  scope: SearchScope
  address: string
  mobile?: boolean
  children: ReactNode
  labelOnly?: boolean
}> = ({ scope, address, children, labelOnly }) => {
  const to = RouteUtils.getAccountRoute(scope, address)
  return (
    <WithHoverHighlighting address={address}>
      {labelOnly ? (
        <span className="text-foreground font-medium">{children}</span>
      ) : (
        <Link asChild className="font-medium">
          <RouterLink to={to}>{children}</RouterLink>
        </Link>
      )}
    </WithHoverHighlighting>
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
   * Use adaptive trimming, ignoring the size
   */
  alwaysAdapt?: boolean

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

// We want two lines, one for name (if available), one for address
// Both lines adaptively shortened to fill available space
const AdaptivelyTrimmedAccountLink: FC<
  Pick<Props, 'scope' | 'address' | 'labelOnly' | 'showOnlyAddress'> & {
    tooltipTitle: ReactNode
  }
> = ({ scope, address, labelOnly, showOnlyAddress, tooltipTitle }) => {
  const {
    metadata: accountMetadata,
    // isError, // Use this to indicate that we have failed to load the name for this account
  } = useAccountMetadata(scope, address)
  const accountName = accountMetadata?.name // TODO: we should also use the description
  const showAccountName = !showOnlyAddress && !!accountName

  return (
    <WithTypographyAndLink scope={scope} address={address} mobile labelOnly={labelOnly}>
      <div className="flex items-center gap-1 flex-wrap">
        {showAccountName && (
          <span className="inline-flex items-center gap-1">
            <AccountMetadataSourceIndicator source={accountMetadata.source} />
            <AdaptiveHighlightedText
              idPrefix="account-name"
              text={accountName}
              extraTooltip={tooltipTitle}
              minLength={5}
            />
          </span>
        )}
        <AdaptiveTrimmer
          idPrefix="account-address"
          text={showAccountName ? `(${address})` : address}
          strategy="middle"
          tooltipOverride={tooltipTitle}
          minLength={13}
        />
      </div>
    </WithTypographyAndLink>
  )
}

const TrimmedAccountLink: FC<
  Pick<Props, 'scope' | 'address' | 'labelOnly' | 'showOnlyAddress'> & { tooltipTitle: ReactNode }
> = ({ scope, address, labelOnly, tooltipTitle, showOnlyAddress }) => {
  const {
    metadata: accountMetadata,
    // isError, // Use this to indicate that we have failed to load the name for this account
  } = useAccountMetadata(scope, address)
  const accountName = accountMetadata?.name // TODO: we should also use the description
  const showAccountName = !showOnlyAddress && !!accountName
  return (
    <WithTypographyAndLink scope={scope} address={address} labelOnly={labelOnly}>
      <MaybeWithTooltip title={tooltipTitle}>
        {showAccountName ? (
          <span className="flex items-center gap-1">
            <AccountMetadataSourceIndicator source={accountMetadata!.source} />{' '}
            {trimLongString(accountName, 12, 0)}
          </span>
        ) : (
          trimLongString(address, 6, 6)
        )}
      </MaybeWithTooltip>
    </WithTypographyAndLink>
  )
}

const DesktopAccountLink: FC<
  Pick<Props, 'scope' | 'address' | 'labelOnly' | 'showOnlyAddress'> & {
    tooltipTitle: ReactNode
  }
> = ({ scope, address, labelOnly, showOnlyAddress, tooltipTitle }) => {
  const {
    metadata: accountMetadata,
    // isError, // Use this to indicate that we have failed to load the name for this account
  } = useAccountMetadata(scope, address)
  const accountName = accountMetadata?.name // TODO: we should also use the description
  const showAccountName = !showOnlyAddress && !!accountName
  return (
    <WithTypographyAndLink scope={scope} address={address} labelOnly={labelOnly}>
      <MaybeWithTooltip title={tooltipTitle}>
        {showAccountName ? (
          <div className="flex items-center flex-wrap gap-1">
            <span className="inline-flex items-center gap-1">
              <AccountMetadataSourceIndicator source={accountMetadata!.source} />
              <HighlightedText text={accountName} />
            </span>
            ({address})
          </div>
        ) : (
          address
        )}
      </MaybeWithTooltip>
    </WithTypographyAndLink>
  )
}

export const AccountLink: FC<Props> = ({
  showOnlyAddress,
  scope,
  address,
  alwaysTrim,
  alwaysTrimOnTablet,
  alwaysAdapt,
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
    <div className="flex items-center align-middle gap-1">
      <Info size="18" className="stroke-zinc-500" />
      {extraTooltip}
    </div>
  ) : undefined

  const tooltipTitle = (
    <div>
      {showAccountName && (
        <div className="inline-flex items-center gap-2">
          <div className="font-bold">{accountName}</div>
          <span>-</span>
          <AccountMetadataSourceIndicator source={accountMetadata!.source} withText />
        </div>
      )}
      <div className="font-normal">{address}</div>
      {extraTooltipWithIcon}
    </div>
  )

  // Are we in a situation when we should always trim?
  if (alwaysTrim || (alwaysTrimOnTablet && isTablet)) {
    // In a table, we only ever want a short line
    return (
      <TrimmedAccountLink
        scope={scope}
        address={address}
        showOnlyAddress={showOnlyAddress}
        labelOnly={labelOnly}
        tooltipTitle={tooltipTitle}
      />
    )
  }

  if (!isTablet && !alwaysAdapt) {
    // We are in desktop mode, and there is no need to do adaptive trimming
    // We want one long line, with name and address.

    return (
      <DesktopAccountLink
        scope={scope}
        address={address}
        showOnlyAddress={showOnlyAddress}
        labelOnly={labelOnly}
        tooltipTitle={tooltipTitle}
      />
    )
  }

  // We need to use adaptive mode, either because we are on tablet or mobile,
  // or because it has been explicitly requested
  return (
    <AdaptivelyTrimmedAccountLink
      scope={scope}
      address={address}
      showOnlyAddress={showOnlyAddress}
      labelOnly={labelOnly}
      tooltipTitle={tooltipTitle}
    />
  )
}
