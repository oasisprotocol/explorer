import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'

export const ProposalLink: FC<{
  network: Network
  proposalId: string | number
  label?: string
}> = ({ network, proposalId, label = proposalId }) => {
  const to = RouteUtils.getProposalRoute(network, proposalId)
  return (
    <Link asChild className="font-medium">
      <RouterLink to={to}>{label}</RouterLink>
    </Link>
  )
}
