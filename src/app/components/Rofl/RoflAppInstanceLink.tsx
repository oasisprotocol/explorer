import { FC } from 'react'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'
import { Link } from '../Link'

type RoflAppInstanceLinkProps = {
  alwaysTrim?: boolean
  id: string
  network: Network
  rak: string
}

export const RoflAppInstanceLink: FC<RoflAppInstanceLinkProps> = ({ alwaysTrim, id, network, rak }) => {
  const to = RouteUtils.getRoflAppInstanceRoute(network, id, rak)

  return <Link address={rak} to={to} alwaysTrim={alwaysTrim} withSourceIndicator={false} />
}
