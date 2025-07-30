import { FC, PropsWithChildren } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { trimLongString } from '../../utils/trimLongString'
import { HighlightedText, HighlightPattern } from '../HighlightedText'
import Box from '@mui/material/Box'
import { AccountMetadataSourceIndicator } from '../Account/AccountMetadataSourceIndicator'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { WithHighlighting } from '../HighlightingContext/WithHighlighting'
import { AdaptiveTrimmer } from '../AdaptiveTrimmer/AdaptiveTrimmer'
import { AdaptiveHighlightedText } from '../HighlightedText/AdaptiveHighlightedText'
import { HighlightedTrimmedText } from '../HighlightedText/HighlightedTrimmedText'

export type TrimMode = 'fixes' | 'adaptive'

type LinkProps = {
  address: string
  name?: string
  alwaysTrim?: boolean
  trimMode?: TrimMode
  highlightPattern?: HighlightPattern
  to: string
  withSourceIndicator?: boolean
  labelOnly?: boolean
}

export const Link: FC<LinkProps> = ({
  address,
  name,
  alwaysTrim,
  trimMode,
  highlightPattern,
  to,
  withSourceIndicator = true,
  labelOnly,
}) => {
  const { isTablet } = useScreenSize()
  const hasName = name?.toLowerCase() !== address.toLowerCase()

  const tooltipTitle =
    hasName && (withSourceIndicator || isTablet) ? (
      <div>
        {name && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ fontWeight: 'bold' }}>{name}</Box>
            {withSourceIndicator && (
              <>
                <span>-</span>
                <AccountMetadataSourceIndicator source={'SelfProfessed'} withText />
              </>
            )}
          </Box>
        )}
        <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
      </div>
    ) : isTablet ? (
      address
    ) : undefined

  return (
    <MaybeWithTooltip title={tooltipTitle}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {hasName && withSourceIndicator && <AccountMetadataSourceIndicator source={'SelfProfessed'} />}
        <Typography
          variant="mono"
          component="span"
          sx={{ color: labelOnly ? COLORS.brandExtraDark : COLORS.brandDark, fontWeight: 700 }}
        >
          {isTablet ? (
            <TabletLink
              address={address}
              name={name}
              to={to}
              highlightPattern={highlightPattern}
              labelOnly={labelOnly}
              trimMode={trimMode}
            />
          ) : (
            <DesktopLink
              address={address}
              alwaysTrim={alwaysTrim}
              name={name}
              to={to}
              highlightPattern={highlightPattern}
              labelOnly={labelOnly}
              trimMode={trimMode}
            />
          )}
        </Typography>
      </Box>
    </MaybeWithTooltip>
  )
}

type CustomTrimEndLinkLabelProps = {
  name: string
  to: string
  highlightPattern?: HighlightPattern
  labelOnly?: boolean
  trimMode?: TrimMode
}

const LinkLabel: FC<PropsWithChildren> = ({ children }) => (
  <Typography component={'span'} fontSize={'inherit'} fontWeight={'inherit'} lineHeight={'inherit'}>
    <span>{children}</span>
  </Typography>
)

const CustomTrimEndLinkLabel: FC<CustomTrimEndLinkLabelProps> = ({
  name,
  to,
  highlightPattern,
  labelOnly,
  trimMode,
}) => {
  const label =
    trimMode === 'adaptive' ? (
      <AdaptiveHighlightedText text={name} pattern={highlightPattern} minLength={14} />
    ) : (
      <HighlightedTrimmedText text={name} pattern={highlightPattern} fragmentLength={14} />
    )
  return labelOnly ? (
    <LinkLabel>{label}</LinkLabel>
  ) : (
    <MuiLink component={RouterLink} to={to}>
      {label}
    </MuiLink>
  )
}

type TabletLinkProps = {
  address: string
  name?: string
  to: string
  highlightPattern?: HighlightPattern
  labelOnly?: boolean
  trimMode?: TrimMode
}

const TabletLink: FC<TabletLinkProps> = ({ address, name, to, highlightPattern, labelOnly, trimMode }) => {
  if (name) {
    return (
      <CustomTrimEndLinkLabel
        name={name}
        to={to}
        highlightPattern={highlightPattern}
        labelOnly={labelOnly}
        trimMode={trimMode}
      />
    )
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
    <MuiLink component={RouterLink} to={to}>
      {label}
    </MuiLink>
  )
}

type DesktopLinkProps = TabletLinkProps & {
  alwaysTrim?: boolean
  labelOnly?: boolean
}

const DesktopLink: FC<DesktopLinkProps> = ({
  address,
  name,
  to,
  alwaysTrim,
  trimMode,
  highlightPattern,
  labelOnly,
}) => {
  if (alwaysTrim) {
    return (
      <WithHighlighting address={address}>
        {name ? (
          <CustomTrimEndLinkLabel
            name={name}
            to={to}
            highlightPattern={highlightPattern}
            labelOnly={labelOnly}
            trimMode={trimMode}
          />
        ) : labelOnly ? (
          <LinkLabel>{trimLongString(address)}</LinkLabel>
        ) : (
          <MuiLink component={RouterLink} to={to}>
            {trimLongString(address)}
          </MuiLink>
        )}
      </WithHighlighting>
    )
  }
  const label = name ? <HighlightedText text={name} pattern={highlightPattern} /> : address
  return (
    <WithHighlighting address={address}>
      {labelOnly ? (
        <LinkLabel>{label}</LinkLabel>
      ) : (
        <MuiLink component={RouterLink} to={to}>
          {label}
        </MuiLink>
      )}
    </WithHighlighting>
  )
}
