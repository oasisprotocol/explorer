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
import { useClientSidePagination } from '../../components/Table/useClientSidePagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useStringInUrl } from '../../hooks/useStringInUrl'

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

export const useWantedVoteType = () => {
  const { value, setValue } = useStringInUrl('vote', 'any')

  return {
    wantedVoteType: value as VoteType,
    setWantedVoteType: (newType: VoteType) => setValue(newType, { deleteParams: ['page'] }),
  }
}

const useWantedVoteFilter = (): VoteFilter => getFilterForVoteType(useWantedVoteType().wantedVoteType)

export const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const useDisplayedVotes = (network: Network, proposalId: number) => {
  const filter = useWantedVoteFilter()

  const pagination = useClientSidePagination<ExtendedVote, AllVotesData>({
    paramName: 'page',
    clientPageSize: PAGE_SIZE,
    serverPageSize: 1000,
    filter,
  })

  // Get all the votes
  const allVotes = useAllVotes(network, proposalId)

  // Get the section of the votes that we should display in the table
  return pagination.getResults(allVotes)
}
