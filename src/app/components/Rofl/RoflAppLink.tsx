import { FC } from 'react'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { Link, TrimMode } from '../Link'
import { HighlightPattern } from '../HighlightedText'

type RoflAppLinkProps = {
  id: string
  name?: string
  network: Network
  alwaysTrim?: boolean
  trimMode?: TrimMode
  highlightPattern?: HighlightPattern
  withSourceIndicator?: boolean
  labelOnly?: boolean
}

export const RoflAppLink: FC<RoflAppLinkProps> = ({
  id,
  name,
  network,
  alwaysTrim,
  trimMode,
  highlightPattern,
  withSourceIndicator,
  labelOnly,
}) => {
  const to = RouteUtils.getRoflAppRoute(network, id)

  return (
    <Link
      address={id}
      name={name}
      to={to}
      alwaysTrim={alwaysTrim}
      trimMode={trimMode}
      highlightPattern={highlightPattern}
      withSourceIndicator={withSourceIndicator}
      labelOnly={labelOnly}
    />
  )
}
