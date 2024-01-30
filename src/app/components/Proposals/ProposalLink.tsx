import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'

export const ProposalLink: FC<{
  network: Network
  proposalId: string | number
  label?: string
}> = ({ network, proposalId, label = proposalId }) => {
  const to = RouteUtils.getProposalRoute(network, proposalId)
  return (
    <Link component={RouterLink} to={to}>
      {label}
    </Link>
  )
}
