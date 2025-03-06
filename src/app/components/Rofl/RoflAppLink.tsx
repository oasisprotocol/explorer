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

type RoflAppLinkProps = {
  id: string
  name?: string
  network: Network
  alwaysTrim?: boolean
  highlightedPartOfName?: string
}

export const RoflAppLink: FC<RoflAppLinkProps> = ({
  id,
  name,
  network,
  alwaysTrim,
  highlightedPartOfName,
}) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getRoflAppRoute(network, id)
  // TODO - get ROFL app name when API is ready
  const roflappName = undefined

  return (
    <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
      {isTablet ? (
        <TabletRoflAppLink
          id={id}
          name={name || roflappName}
          to={to}
          highlightedPart={highlightedPartOfName}
        />
      ) : (
        <DesktopRoflAppLink
          id={id}
          alwaysTrim={alwaysTrim}
          name={name || roflappName}
          to={to}
          highlightedPart={highlightedPartOfName}
        />
      )}
    </Typography>
  )
}

type TrimRoflAppEndLinkLabelProps = {
  name: string
  to: string
  highlightedPart?: string
}

const TrimRoflAppEndLinkLabel: FC<TrimRoflAppEndLinkLabelProps> = ({ name, to, highlightedPart }) => (
  <TrimEndLinkLabel label={name} to={to} trimStart={14} highlightedPart={highlightedPart} />
)

type TabletRoflAppLinkProps = {
  id: string
  name?: string
  to: string
  highlightedPart?: string
}

const TabletRoflAppLink: FC<TabletRoflAppLinkProps> = ({ id, name, to, highlightedPart }) => {
  if (name) {
    return <TrimRoflAppEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
  }
  return <TrimLinkLabel label={id} to={to} />
}

type DesktopRoflAppLinkProps = TabletRoflAppLinkProps & {
  alwaysTrim?: boolean
}

const DesktopRoflAppLink: FC<DesktopRoflAppLinkProps> = ({ id, name, to, alwaysTrim, highlightedPart }) => {
  if (alwaysTrim) {
    return name ? (
      <TrimRoflAppEndLinkLabel name={name} to={to} highlightedPart={highlightedPart} />
    ) : (
      <TrimLinkLabel label={id} to={to} />
    )
  }
  return (
    <Link component={RouterLink} to={to}>
      {name ? <HighlightedText text={name} pattern={highlightedPart} /> : id}
    </Link>
  )
}
