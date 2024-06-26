import { Proposal } from 'oasis-nexus/api'

export const getProposalName = (proposal: Proposal) =>
  proposal.handler || (proposal.parameters_change && Object.keys(proposal.parameters_change).join(', '))
