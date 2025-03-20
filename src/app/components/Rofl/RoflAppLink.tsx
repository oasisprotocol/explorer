import { FC } from 'react'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { Link } from '../Link'

type RoflAppLinkProps = {
  id: string
  name?: string
  network: Network
  alwaysTrim?: boolean
  highlightedPartOfName?: string
  withSourceIndicator?: boolean
}

export const RoflAppLink: FC<RoflAppLinkProps> = ({
  id,
  name,
  network,
  alwaysTrim,
  highlightedPartOfName,
  withSourceIndicator,
}) => {
  const to = RouteUtils.getRoflAppRoute(network, id)

  return (
    <Link
      address={id}
      name={name}
      to={to}
      alwaysTrim={alwaysTrim}
      highlightedPartOfName={highlightedPartOfName}
      withSourceIndicator={withSourceIndicator}
    />
  )
}
