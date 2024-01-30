import { TFunction } from 'i18next'
import { Proposal } from '../oasis-nexus/api'

export type ProposalType = (typeof ProposalType)[keyof typeof ProposalType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ProposalType = {
  upgrade: 'upgrade',
  parameterUpgrade: 'parameterUpgrade',
  cancellation: 'cancellation',
} as const

/**
 * Detect the proposal type from looking at the data
 *
 * if type=Cancellation, the cancels field will be nonempty
 * if type=ParameterUpgrade, the parameters_change_module and parameters_change fields will be nonempty
 * if type=Upgrade, all of the above fields will be empty
 */
export const detectProposalType = (proposal: Proposal): ProposalType => {
  const { cancels, parameters_change } = proposal
  if (cancels) return ProposalType.cancellation
  if (parameters_change) return ProposalType.parameterUpgrade
  return ProposalType.upgrade
}

export const getProposalTypeNames = (t: TFunction): Record<ProposalType, string> => ({
  [ProposalType.upgrade]: t('networkProposal.type.upgrade'),
  [ProposalType.parameterUpgrade]: t('networkProposal.type.parameterUpgrade'),
  [ProposalType.cancellation]: t('networkProposal.type.cancellation'),
})

export const getTypeNameForProposal = (t: TFunction, proposal: Proposal) => {
  const names = getProposalTypeNames(t)
  const wantedType = detectProposalType(proposal)
  return names[wantedType]
}
