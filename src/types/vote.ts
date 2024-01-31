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

export const getRandomVote = (): ProposalVoteValue =>
  [ProposalVoteValue.yes, ProposalVoteValue.no, ProposalVoteValue.abstain][Math.floor(Math.random() * 3)]

export type VoteType = ProposalVoteValue | 'any'

export type ExtendedVote = ProposalVote & {
  index: number
  areValidatorsLoading: boolean
  haveValidatorsFailed: boolean
  validator?: Validator
}

export type VoteFilter = (vote: ExtendedVote) => boolean

const voteFilters: Record<VoteType, VoteFilter> = {
  any: () => true,
  yes: vote => vote.vote === ProposalVoteValue.yes,
  no: vote => vote.vote === ProposalVoteValue.no,
  abstain: vote => vote.vote === ProposalVoteValue.abstain,
}

export const getFilterForVoteType = (voteType: VoteType): VoteFilter => voteFilters[voteType]
