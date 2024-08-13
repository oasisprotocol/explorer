import { Proposal } from 'oasis-nexus/api'
import { detectProposalType, ProposalType } from '../../types/proposalType'
import { exhaustedTypeWarning } from 'types/errors'

export const getCancelTitle = (cancelId: Proposal['cancels']) => `cancel-upgrade-${cancelId}`

const parameterChangePrefix = 'change-parameter'
export const getParameterChangeTitle = (
  module: Proposal['parameters_change_module'],
  parameter: Proposal['parameters_change'],
) => {
  if (parameter && typeof parameter === 'object') {
    const updatedParameters = Object.keys(parameter)
      .filter(key => (parameter as Record<string, any>)[key] !== null)
      .join(', ')
    return `${parameterChangePrefix}-${module}-${updatedParameters}`
  }
  return parameterChangePrefix
}

export const getProposalTitle = (proposal: Proposal): string | undefined => {
  // Oasis Core v24.0 introduced new, optional metadata like "title" for each proposal
  if (proposal.title) {
    return proposal.title
  }

  const type = detectProposalType(proposal)

  switch (type) {
    case ProposalType.upgrade:
      return proposal.handler!
    case ProposalType.parameterUpgrade:
      return getParameterChangeTitle(proposal.parameters_change_module, proposal.parameters_change)
    case ProposalType.cancellation:
      return getCancelTitle(proposal.cancels)
    default:
      exhaustedTypeWarning('Unexpected result type', type)
  }
}
