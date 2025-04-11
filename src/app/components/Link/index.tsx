import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import MuiLink from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { trimLongString } from '../..//utils/trimLongString'
import { HighlightedText } from '../HighlightedText'
import Box from '@mui/material/Box'
import { AccountMetadataSourceIndicator } from '../Account/AccountMetadataSourceIndicator'
import { MaybeWithTooltip } from '../Tooltip/MaybeWithTooltip'
import { WithHighlighting } from '../HighlightingContext/WithHighlighting'
import { HighlightedTrimmedText } from '../HighlightedText/HighlightedTrimmedText'

type LinkProps = {
  address: string
  name?: string
  alwaysTrim?: boolean
  highlightedPartOfName?: string
  to: string
  withSourceIndicator?: boolean
}

export const Link: FC<LinkProps> = ({
  address,
  name,
  alwaysTrim,
  highlightedPartOfName,
  to,
  withSourceIndicator = true,
}) => {
  const { isTablet } = useScreenSize()
  const hasName = name?.toLowerCase() !== address.toLowerCase()

  const tooltipTitle =
    hasName && withSourceIndicator ? (
      <div>
        {name && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ fontWeight: 'bold' }}>{name}</Box>
            <span>-</span>
            <AccountMetadataSourceIndicator source={'SelfProfessed'} withText />
          </Box>
        )}
        <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
      </div>
    ) : undefined

  return (
    <MaybeWithTooltip title={tooltipTitle}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {hasName && withSourceIndicator && <AccountMetadataSourceIndicator source={'SelfProfessed'} />}
        <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
          {isTablet ? (
            <TabletLink address={address} name={name} to={to} highlightedPart={highlightedPartOfName} />
          ) : (
            <DesktopLink
              address={address}
              alwaysTrim={alwaysTrim}
              name={name}
              to={to}
              highlightedPart={highlightedPartOfName}
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
  highlightedPart?: string
}

const CustomTrimEndLinkLabel: FC<CustomTrimEndLinkLabelProps> = ({ name, to, highlightedPart }) => {
  return (
    <MuiLink component={RouterLink} to={to}>
      <HighlightedTrimmedText text={name} pattern={highlightedPart} fragmentLength={14} />
    </MuiLink>
  )
}

type TabletLinkProps = {
  address: string
  name?: string
  to: string
  highlightedPart?: string
}

const TabletLink: FC<TabletLinkProps> = ({ address, name, to, highlightedPart }) => {
  if (name) {
    return <CustomTrimEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
  }
  return (
    <MuiLink component={RouterLink} to={to}>
      {trimLongString(address)}
    </MuiLink>
  )
}

type DesktopLinkProps = TabletLinkProps & {
  alwaysTrim?: boolean
}

const DesktopLink: FC<DesktopLinkProps> = ({ address, name, to, alwaysTrim, highlightedPart }) => {
  if (alwaysTrim) {
    return (
      <WithHighlighting address={address}>
        {name ? (
          <CustomTrimEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
        ) : (
          <MuiLink component={RouterLink} to={to}>
            {trimLongString(address)}
          </MuiLink>
        )}
      </WithHighlighting>
    )
  }
  return (
    <WithHighlighting address={address}>
      <MuiLink component={RouterLink} to={to}>
        {name ? <HighlightedText text={name} pattern={highlightedPart} /> : address}
      </MuiLink>
    </WithHighlighting>
  )
}
