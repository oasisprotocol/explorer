import { ExtendedVote, ProposalVoteValue, VoteFilter, VoteType } from '../../types/vote'
import { hasTextMatch } from '../components/HighlightedText/text-matching'

export const getRandomVote = (): ProposalVoteValue =>
  [ProposalVoteValue.yes, ProposalVoteValue.no, ProposalVoteValue.abstain][Math.floor(Math.random() * 3)]

const voteFilters: Record<VoteType, VoteFilter> = {
  any: () => true,
  yes: vote => vote.vote === ProposalVoteValue.yes,
  no: vote => vote.vote === ProposalVoteValue.no,
  abstain: vote => vote.vote === ProposalVoteValue.abstain,
}

export const getFilterForVoteType = (voteType: VoteType): VoteFilter => voteFilters[voteType]

export const getFilterForVoterNameFragment = (fragment: string | undefined) => {
  if (!fragment) {
    return () => true
  }
  return (vote: ExtendedVote) => hasTextMatch(vote.validator?.media?.name, [fragment])
}
