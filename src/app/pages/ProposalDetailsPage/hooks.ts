import {
  Validator,
  ExtendedValidatorList,
  List,
  useGetConsensusProposalsProposalIdVotes,
  useGetConsensusValidators,
} from '../../../oasis-nexus/api'
import { Network } from '../../../types/network'
import { ExtendedVote, ProposalVoteValue, VoteType } from '../../../types/vote'
import { getFilterForVoterNameFragment, getFilterForVoteType, getRandomVote } from '../../utils/vote'
import { useClientSidePagination } from '../../components/Table/useClientSidePagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

export type AllVotesData = List & {
  isLoading: boolean
  isError: boolean
  loadedVotes: ExtendedVote[]
}

const DEBUG_MODE = false

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
    map: (data?.data as ExtendedValidatorList)?.map ?? new Map<string, Validator>(),
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
      index,
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
    total_count: data?.data.total_count ?? 0, // We need fallbacks here so that we always satisfy the List interface
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
  const { isLoading, isError, loadedVotes, is_total_count_clipped } = useAllVotes(network, proposalId)
  const tally: Record<ProposalVoteValue, bigint> = {
    yes: 0n,
    no: 0n,
    abstain: 0n,
  }
  // TODO: instead of 1n, we should add the power of the vote, but that data is not available yet.
  loadedVotes.forEach(vote => (tally[vote.vote as ProposalVoteValue] += 1n))
  const allVotesCount = loadedVotes.length
  const allVotesPower = tally.yes + tally.no + tally.abstain
  const isComplete = !isError && !is_total_count_clipped
  return {
    isLoading,
    isError,
    isComplete,
    tally,
    allVotesCount,
    allVotesPower,
  }
}

export const useVoteFiltering = () => {
  const { t } = useTranslation()
  const setSearchParams = useSearchParams()[1]
  const [wantedType, setWantedType] = useTypedSearchParam<VoteType>('vote', 'any', {
    deleteParams: ['page'],
  })
  const [wantedNameInput, setWantedNameInput] = useTypedSearchParam('voter', '', { deleteParams: ['page'] })
  const wantedNamePattern = wantedNameInput.length < 3 ? undefined : wantedNameInput
  const nameError = !!wantedNameInput && !wantedNamePattern ? t('tableSearch.error.tooShort') : undefined
  const hasFilters = wantedType !== 'any' || !!wantedNamePattern
  const clearFilters = () => {
    setSearchParams(searchParams => {
      searchParams.delete('vote')
      searchParams.delete('voter')
      searchParams.delete('page')
      return searchParams
    })
  }
  return {
    wantedType,
    setWantedType,
    wantedNameInput,
    setWantedNameInput,
    wantedNamePattern,
    nameError,
    hasFilters,
    clearFilters,
  }
}

export const useVotes = (network: Network, proposalId: number) => {
  const { hasFilters, wantedType, wantedNamePattern } = useVoteFiltering()
  const typeFilter = getFilterForVoteType(wantedType)
  const nameFilter = getFilterForVoterNameFragment(wantedNamePattern)

  const pagination = useClientSidePagination<ExtendedVote, AllVotesData>({
    paramName: 'page',
    clientPageSize: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    serverPageSize: 1000,
    filter: (vote: ExtendedVote) => typeFilter(vote) && nameFilter(vote),
  })

  // Get all the votes
  const allVotes = useAllVotes(network, proposalId)

  // Get the section of the votes that we should display in the table
  const results = pagination.getResults(allVotes)

  const { isLoading } = allVotes
  const isOnFirstPage = results.tablePaginationProps.selectedPage === 1
  const hasData = !!results.data?.length
  const hasNoResultsOnSelectedPage = !isLoading && !isOnFirstPage && !hasData
  const hasNoResultsWhatsoever = !isLoading && !allVotes.total_count
  const hasNoResultsBecauseOfFilters =
    !isLoading && !hasData && isOnFirstPage && hasFilters && !hasNoResultsWhatsoever

  return {
    results,
    isLoading,
    hasNoResultsOnSelectedPage,
    hasNoResultsBecauseOfFilters,
    hasNoResultsWhatsoever,
  }
}
