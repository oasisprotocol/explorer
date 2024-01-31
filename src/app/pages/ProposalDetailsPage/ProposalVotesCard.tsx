import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { SubPageCard } from '../../components/SubPageCard'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { useTranslation } from 'react-i18next'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { ExtendedVote, ProposalVoteValue } from '../../../types/vote'
import {
  PAGE_SIZE,
  useDisplayedVotes,
  useOrder,
  useVoterSearch,
  useVoterSearchPattern,
  useWantedVoteType,
} from './hooks'
import { ProposalVoteIndicator } from '../../components/Proposals/ProposalVoteIndicator'
import { DeferredValidatorLink } from '../../components/Validators/DeferredValidatorLink'
import { CardHeaderWithResponsiveActions } from '../../components/CardHeaderWithResponsiveActions'
import { VoteTypePills } from '../../components/Proposals/VoteTypePills'
import { AppErrors } from '../../../types/errors'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { VoterSearchBar } from '../../components/Proposals/VoterSearchBar'

type ProposalVotesProps = {
  isLoading: boolean
  votes: ExtendedVote[] | undefined
  limit: number
  pagination: TablePaginationProps
}

const ProposalVotes: FC<ProposalVotesProps> = ({ isLoading, votes, limit, pagination }) => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const voterNameFragment = useVoterSearchPattern()
  const { toggleReverse: toggleReverseOrder } = useOrder()

  const OrderTrigger: FC = () => <SwapVertIcon onClick={toggleReverseOrder} />

  const tableColumns: TableColProps[] = [
    { key: 'index', content: <OrderTrigger />, width: '50px' },
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
              isError={vote.haveValidatorsFailed}
              validator={vote.validator}
              highlightedPart={voterNameFragment}
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

  const displayedVotes = useDisplayedVotes(network, proposalId)

  if (
    !displayedVotes.isLoading &&
    displayedVotes.tablePaginationProps.selectedPage > 1 &&
    !displayedVotes.data?.length
  ) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <ProposalVotes
      isLoading={displayedVotes.isLoading}
      votes={displayedVotes.data}
      limit={PAGE_SIZE}
      pagination={displayedVotes.tablePaginationProps}
    />
  )
}

export const ProposalVotesCard: FC = () => {
  const { t } = useTranslation()

  const { wantedVoteType, setWantedVoteType } = useWantedVoteType()
  const { voterSearchInput, setVoterSearchPattern } = useVoterSearch()

  return (
    <SubPageCard>
      <CardHeaderWithResponsiveActions
        action={
          <>
            <VoterSearchBar variant={'button'} value={voterSearchInput} onChange={setVoterSearchPattern} />
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
