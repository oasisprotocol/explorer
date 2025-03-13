import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { TrimLinkLabel, TrimEndLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'
import { HighlightedText } from '../HighlightedText'
import { useValidatorName } from '../../hooks/useValidatorName'
import Box from '@mui/material/Box'
import { AccountMetadataSourceIndicator } from '../Account/AccountMetadataSourceIndicator'
import { MaybeWithTooltip } from '../AdaptiveTrimmer/MaybeWithTooltip'

type ValidatorLinkProps = {
  address: string
  name?: string
  network: Network
  alwaysTrim?: boolean
  highlightedPartOfName?: string
}

export const ValidatorLink: FC<ValidatorLinkProps> = ({
  address,
  name,
  network,
  alwaysTrim,
  highlightedPartOfName,
}) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getValidatorRoute(network, address)
  const validatorName = useValidatorName(network, address)

  const displayName = name ?? validatorName

  const tooltipTitle = (
    <div>
      {displayName && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ fontWeight: 'bold' }}>{displayName}</Box>
          <span>-</span>
          <AccountMetadataSourceIndicator source={'SelfProfessed'} withText />
        </Box>
      )}
      <Box sx={{ fontWeight: 'normal' }}>{address}</Box>
    </div>
  )

  return (
    <MaybeWithTooltip title={tooltipTitle}>
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <AccountMetadataSourceIndicator source={'SelfProfessed'} />{' '}
        <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
          {isTablet ? (
            <TabletValidatorLink
              address={address}
              name={displayName}
              to={to}
              highlightedPart={highlightedPartOfName}
            />
          ) : (
            <DesktopValidatorLink
              address={address}
              alwaysTrim={alwaysTrim}
              name={displayName}
              to={to}
              highlightedPart={highlightedPartOfName}
            />
          )}
        </Typography>
      </Box>
    </MaybeWithTooltip>
  )
}

type TrimValidatorEndLinkLabelProps = {
  name: string
  to: string
  highlightedPart?: string
}

const TrimValidatorEndLinkLabel: FC<TrimValidatorEndLinkLabelProps> = ({ name, to, highlightedPart }) => (
  <TrimEndLinkLabel label={name} to={to} trimStart={14} highlightedPart={highlightedPart} />
)

type TabletValidatorLinkProps = {
  address: string
  name?: string
  to: string
  highlightedPart?: string
}

const TabletValidatorLink: FC<TabletValidatorLinkProps> = ({ address, name, to, highlightedPart }) => {
  if (name) {
    return <TrimValidatorEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
  }
  return <TrimLinkLabel label={address} to={to} />
}

type DesktopValidatorLinkProps = TabletValidatorLinkProps & {
  alwaysTrim?: boolean
}

const DesktopValidatorLink: FC<DesktopValidatorLinkProps> = ({
  address,
  name,
  to,
  alwaysTrim,
  highlightedPart,
}) => {
  if (alwaysTrim) {
    return name ? (
      <TrimValidatorEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
    ) : (
      <TrimLinkLabel label={address} to={to} />
    )
  }
  return (
    <Link component={RouterLink} to={to}>
      {name ? <HighlightedText text={name} pattern={highlightedPart} /> : address}
    </Link>
  )
}
