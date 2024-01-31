import { ProposalVote, Validator } from '../oasis-nexus/api'

export type ProposalVoteValue = (typeof ProposalVoteValue)[keyof typeof ProposalVoteValue]

/**
 * Valid vote types for network proposals
 *
 * Based on https://github.com/oasisprotocol/nexus/blob/main/storage/oasis/nodeapi/api.go#L199
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ProposalVoteValue = {
  yes: 'yes',
  no: 'no',
  abstain: 'abstain',
} as const

export type VoteType = ProposalVoteValue | 'any'

export type ExtendedVote = ProposalVote & {
  index: number
  areValidatorsLoading: boolean
  haveValidatorsFailed: boolean
  validator?: Validator
}

export type VoteFilter = (vote: ExtendedVote) => boolean
