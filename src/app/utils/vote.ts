import { ExtendedVote } from '../../types/vote'
import { hasTextMatchesForAll } from '../components/HighlightedText/text-matching'

export const getFilterForVoterNameFragment = (fragments: string[]) =>
  fragments.length
    ? (vote: ExtendedVote) => hasTextMatchesForAll(vote.validator?.media?.name, fragments)
    : () => true
