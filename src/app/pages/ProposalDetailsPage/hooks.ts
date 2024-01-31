import {
  List,
  useGetConsensusProposalsProposalIdVotes,
  useGetConsensusValidators,
} from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import {
  ExtendedVote,
  getFilterForVoteType,
  getRandomVote,
  ProposalVoteValue,
  VoteFilter,
  VoteType,
} from '../../../types/vote'
import { useSearchParams } from 'react-router-dom'

export type AllVotesData = List & {
  isLoading: boolean
  isError: boolean
  loadedVotes: ExtendedVote[]
}

const DEBUG_MODE = true // TODO disable debug mode before merging

const voteTable: Record<string, ProposalVoteValue> = {}

const getRandomVoteFor = (address: string) => {
  const storedVote = voteTable[address]
  if (storedVote) return storedVote
  const newVote = getRandomVote()
  voteTable[address] = newVote
  return newVote
}

const useValidatorMap = (network: Network) => {
  const { data, isLoading, isError } = useGetConsensusValidators(network)
  return {
    isLoading,
    isError,
    map: (data as any)?.data.map ?? new Map(),
  }
}

export const useAllVotes = (network: Network, proposalId: number): AllVotesData => {
  const query = useGetConsensusProposalsProposalIdVotes(network, proposalId)
  const {
    map: validators,
    isLoading: areValidatorsLoading,
    isError: haveValidatorsFailed,
  } = useValidatorMap(network)
  const { isLoading, isError, data } = query

  const extendedVotes = (data?.data.votes || []).map(
    (vote, index): ExtendedVote => ({
      ...vote,
      index: index + 1,
      areValidatorsLoading,
      haveValidatorsFailed,
      validator: validators.get(vote.address),
    }),
  )

  return {
    isLoading,
    isError,
    loadedVotes: DEBUG_MODE
      ? extendedVotes.map(v => ({ ...v, vote: getRandomVoteFor(v.address) })) || []
      : extendedVotes,
    total_count: data?.data.total_count ?? 0,
    is_total_count_clipped: data?.data.is_total_count_clipped ?? false,
  }
}

export type VoteStats = {
  isLoading: boolean
  isError: boolean

  /**
   * Did we manage to get all data from the server?
   */
  isComplete: boolean

  /**
   * The results of counting the votes
   */
  tally: Record<ProposalVoteValue, bigint>

  /**
   * The total number of (valid) votes
   */
  allVotesCount: number

  /**
   * The total amount of valid votes (considering the shares)
   */
  allVotesPower: bigint
}

export const useVoteStats = (network: Network, proposalId: number): VoteStats => {
  const { isLoading, isError, loadedVotes, total_count, is_total_count_clipped } = useAllVotes(
    network,
    proposalId,
  )
  const tally: Record<ProposalVoteValue, bigint> = {
    yes: 0n,
    no: 0n,
    abstain: 0n,
  }
  // TODO: instead of 1n, we should add the power of the vote, but that data is not available yet.
  loadedVotes.forEach(vote => (tally[vote.vote as ProposalVoteValue] += 1n))
  const allVotesCount = loadedVotes.length
  const allVotesPower = tally.yes + tally.no + tally.abstain
  const isComplete = !isError && loadedVotes.length === total_count && !is_total_count_clipped
  return {
    isLoading,
    isError,
    isComplete,
    tally,
    allVotesCount,
    allVotesPower,
  }
}

const TYPE_PARAM = 'vote'
export const useWantedVoteType = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const wantedVoteType: VoteType = (searchParams.get(TYPE_PARAM) as VoteType) ?? 'any'
  const setWantedVoteType = (newType: VoteType) => {
    if (newType === 'any') {
      searchParams.delete(TYPE_PARAM)
    } else {
      searchParams.set(TYPE_PARAM, newType)
    }
    searchParams.delete('page')
    setSearchParams(searchParams, { preventScrollReset: true })
  }
  return { wantedVoteType, setWantedVoteType }
}

const SEARCH_PARAM = 'voter'

export const useVoterSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const voterSearchInput = searchParams.get(SEARCH_PARAM) ?? ''
  const setVoterSearchPattern = (pattern: string) => {
    if (pattern === '') {
      searchParams.delete(SEARCH_PARAM)
    } else {
      searchParams.set(SEARCH_PARAM, pattern)
    }
    searchParams.delete('page')
    setSearchParams(searchParams, { preventScrollReset: true })
  }
  return { voterSearchInput, setVoterSearchPattern }
}

export const useVoterSearchPattern = () => {
  const { voterSearchInput } = useVoterSearch()
  return voterSearchInput.length < 3 ? undefined : voterSearchInput
}

export const useWantedVoteFilter = (): VoteFilter => {
  const { wantedVoteType } = useWantedVoteType()
  const voterSearchPattern = useVoterSearchPattern()
  const typeFilter = getFilterForVoteType(wantedVoteType)
  if (!voterSearchPattern) {
    return typeFilter
  } else {
    return (vote: ExtendedVote) =>
      typeFilter(vote) && !!vote.validator?.media?.name?.toLowerCase().includes(voterSearchPattern)
  }
}
