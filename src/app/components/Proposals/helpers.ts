import { Proposal } from 'oasis-nexus/api'

export const getProposalName = (proposal: Proposal): string => {
  if (proposal.handler) {
    return proposal.handler
  } else if (proposal.parameters_change) {
    return Object.keys(proposal.parameters_change).join(', ')
  } else {
    return ''
  }
}
