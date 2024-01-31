import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { SubPageCard } from '../../components/SubPageCard'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { ExtendedVote, ProposalVoteValue } from '../../../types/vote'
import { useClientSidePagination } from '../../components/Table/useClientSidePagination'
import { AllVotesData, useAllVotes, useVoterSearch, useWantedVoteFilter, useWantedVoteType } from './hooks'
import { ProposalVoteIndicator } from '../../components/Proposals/ProposalVoteIndicator'
import { DeferredValidatorLink } from '../../components/Validators/DeferredValidatorLink'
import { CardHeaderWithResponsiveActions } from '../../components/CardHeaderWithResponsiveActions'
import { VoteTypePills } from '../../components/Proposals/VoteTypePills'
import { AppErrors } from '../../../types/errors'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { VoterSearchBar } from '../../components/Proposals/VoterSearchBar'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

type ProposalVotesProps = {
  isLoading: boolean
  votes: ExtendedVote[] | undefined
  limit: number
  pagination: TablePaginationProps
}

const ProposalVotes: FC<ProposalVotesProps> = ({ isLoading, votes, limit, pagination }) => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const tableColumns: TableColProps[] = [
    { key: 'index', content: '', width: '50px' },
    { key: 'voter', content: t('common.voter'), align: TableCellAlign.Left },
    { key: 'vote', content: t('common.vote'), align: TableCellAlign.Right },
  ]
  const tableRows = votes?.map(vote => {
    return {
      key: `vote-${vote.index}`,
      data: [
        {
          key: 'index',
          content: `#${vote.index}`,
        },
        {
          key: 'voter',
          content: (
            <DeferredValidatorLink
              network={scope.network}
              address={vote.address}
              isLoading={vote.areValidatorsLoading}
              isError={vote.haveValidatorsFailed}
              validator={vote.validator}
            />
          ),
        },
        {
          key: 'vote',
          content: <ProposalVoteIndicator vote={vote.vote as ProposalVoteValue} />,
          align: TableCellAlign.Right,
        },
      ],
    }
  })
  return (
    <Table
      name={t('common.votes')}
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}

export const ProposalVotesView: FC = () => {
  const { network } = useRequiredScopeParam()
  const proposalId = parseInt(useParams().proposalId!, 10)

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
  const displayedVotes = pagination.getResults(allVotes)

  if (
    !allVotes.isLoading &&
    displayedVotes.tablePaginationProps.selectedPage > 1 &&
    !displayedVotes.data?.length
  ) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <ProposalVotes
      isLoading={allVotes.isLoading}
      votes={displayedVotes.data}
      limit={PAGE_SIZE}
      pagination={displayedVotes.tablePaginationProps}
    />
  )
}

export const ProposalVotesCard: FC = () => {
  const { t } = useTranslation()

  const { wantedVoteType, setWantedVoteType } = useWantedVoteType()
  const { voterSearchPattern, setVoterSearchPattern } = useVoterSearch()

  return (
    <SubPageCard>
      <CardHeaderWithResponsiveActions
        action={
          <>
            <VoterSearchBar variant={'button'} value={voterSearchPattern} onChange={setVoterSearchPattern} />
            <VoteTypePills handleChange={setWantedVoteType} value={wantedVoteType} />
          </>
        }
        disableTypography
        component="h3"
        title={t('common.votes')}
      />
      <ErrorBoundary light={true}>
        <ProposalVotesView />
      </ErrorBoundary>
    </SubPageCard>
  )
}
