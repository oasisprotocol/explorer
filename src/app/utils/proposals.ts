import { Proposal } from 'oasis-nexus/api'
import { detectProposalType, ProposalType } from '../../types/proposalType'
import { exhaustedTypeWarning } from 'types/errors'

export const getCancelTitle = (cancelId: Proposal['cancels']) => `cancel-upgrade-${cancelId}`
export const getParameterChangeTitle = (parameterChange: Proposal['parameters_change']) => {
  return Object.keys(parameterChange as Record<string, any>).join(', ')
}

export const getProposalTitle = (proposal: Proposal): string | undefined => {
  const type = detectProposalType(proposal)

  switch (type) {
    case ProposalType.upgrade:
      return proposal.handler!
    case ProposalType.parameterUpgrade:
      return getParameterChangeTitle(proposal.parameters_change)
    case ProposalType.cancellation:
      return getCancelTitle(proposal.cancels)
    default:
      exhaustedTypeWarning('Unexpected result type', type)
  }
}
