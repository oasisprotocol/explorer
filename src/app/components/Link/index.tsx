import { FC, PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import { Link as UilLink } from '@oasisprotocol/ui-library/src/components/link'
import { trimLongString } from '../../utils/trimLongString'
import { HighlightedText } from '../HighlightedText'
import { AccountMetadataSourceIndicator } from '../Account/AccountMetadataSourceIndicator'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { WithHoverHighlighting } from '../HoverHighlightingContext/WithHoverHighlighting'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { AdaptiveHighlightedText } from '../HighlightedText/AdaptiveHighlightedText'
import { HighlightedTrimmedText } from '../HighlightedText/HighlightedTrimmedText'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export type TrimMode = 'fixes' | 'adaptive'

type LinkProps = {
  address: string
  name?: string
  alwaysTrim?: boolean
  trimMode?: TrimMode
  to: string
  withSourceIndicator?: boolean
  labelOnly?: boolean
  mono?: boolean
}

export const Link: FC<LinkProps> = ({
  address,
  name,
  alwaysTrim,
  trimMode,
  to,
  withSourceIndicator = true,
  labelOnly,
  mono = true,
}) => {
  const { isTablet } = useScreenSize()
  const hasName = name?.toLowerCase() !== address.toLowerCase()

  const tooltipTitle =
    hasName && (withSourceIndicator || isTablet) ? (
      <div>
        {name && (
          <div className="inline-flex items-center gap-2">
            <div className="font-bold">{name}</div>
            {withSourceIndicator && (
              <>
                <span>-</span>
                <AccountMetadataSourceIndicator source={'SelfProfessed'} withText />
              </>
            )}
          </div>
        )}
        <div className="font-normal">{address}</div>
      </div>
    ) : isTablet ? (
      address
    ) : undefined

  return (
    <MaybeWithTooltip title={tooltipTitle}>
      <div className="inline-flex items-center gap-1">
        {hasName && withSourceIndicator && <AccountMetadataSourceIndicator source={'SelfProfessed'} />}
        <span className={cn(mono ? 'font-mono' : 'font-sans', 'font-medium', !labelOnly && 'text-primary')}>
          {isTablet ? (
            <TabletLink address={address} name={name} to={to} labelOnly={labelOnly} trimMode={trimMode} />
          ) : (
            <DesktopLink
              address={address}
              alwaysTrim={alwaysTrim}
              name={name}
              to={to}
              labelOnly={labelOnly}
              trimMode={trimMode}
            />
          )}
        </span>
      </div>
    </MaybeWithTooltip>
  )
}

type CustomTrimEndLinkLabelProps = {
  name: string
  to: string
  labelOnly?: boolean
  trimMode?: TrimMode
}

const LinkLabel: FC<PropsWithChildren> = ({ children }) => (
  <span className="text-inherit font-inherit leading-inherit">{children}</span>
)

const CustomTrimEndLinkLabel: FC<CustomTrimEndLinkLabelProps> = ({ name, to, labelOnly, trimMode }) => {
  const label =
    trimMode === 'adaptive' ? (
      <AdaptiveHighlightedText text={name} minLength={14} />
    ) : (
      <HighlightedTrimmedText text={name} fragmentLength={14} />
    )
  return labelOnly ? (
    <LinkLabel>{label}</LinkLabel>
  ) : (
    <UilLink asChild>
      <RouterLink to={to}>{label}</RouterLink>
    </UilLink>
  )
}

type TabletLinkProps = {
  address: string
  name?: string
  to: string
  labelOnly?: boolean
  trimMode?: TrimMode
}

const TabletLink: FC<TabletLinkProps> = ({ address, name, to, labelOnly, trimMode }) => {
  if (name) {
    return <CustomTrimEndLinkLabel name={name} to={to} labelOnly={labelOnly} trimMode={trimMode} />
  }

  const label =
    trimMode === 'adaptive' ? (
      <AdaptiveTrimmer text={address} strategy={'middle'} minLength={13} />
    ) : (
      trimLongString(address)
    )
  return labelOnly ? (
    <LinkLabel>{label}</LinkLabel>
  ) : (
    <UilLink asChild>
      <RouterLink to={to}>{label}</RouterLink>
    </UilLink>
  )
}

type DesktopLinkProps = TabletLinkProps & {
  alwaysTrim?: boolean
  labelOnly?: boolean
}

const DesktopLink: FC<DesktopLinkProps> = ({ address, name, to, alwaysTrim, trimMode, labelOnly }) => {
  if (alwaysTrim) {
    return (
      <WithHoverHighlighting address={address}>
        {name ? (
          <CustomTrimEndLinkLabel name={name} to={to} labelOnly={labelOnly} trimMode={trimMode} />
        ) : labelOnly ? (
          <LinkLabel>{trimLongString(address)}</LinkLabel>
        ) : (
          <UilLink asChild>
            <RouterLink to={to}>{trimLongString(address)}</RouterLink>
          </UilLink>
        )}
      </WithHoverHighlighting>
    )
  }
  const label = name ? <HighlightedText text={name} /> : address
  return (
    <WithHoverHighlighting address={address}>
      {labelOnly ? (
        <LinkLabel>{label}</LinkLabel>
      ) : (
        <UilLink asChild>
          <RouterLink to={to}>{label}</RouterLink>
        </UilLink>
      )}
    </WithHoverHighlighting>
  )
}
