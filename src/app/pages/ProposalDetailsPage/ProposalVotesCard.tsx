import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { SubPageCard } from '../../components/SubPageCard'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { ExtendedVote, ProposalVoteValue } from '../../../types/vote'
import { useVotes, useVoteFiltering } from './hooks'
import { ProposalVoteIndicator } from '../../components/Proposals/ProposalVoteIndicator'
import { DeferredValidatorLink } from '../../components/Validators/DeferredValidatorLink'
import { CardHeaderWithResponsiveActions } from '../../components/CardHeaderWithResponsiveActions'
import { VoteTypeFilter } from '../../components/Proposals/VoteTypeFilter'
import { AppErrors } from '../../../types/errors'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import Box from '@mui/material/Box'
import { NoMatchingDataMaybeClearFilters, TableSearchBar } from '../../components/Search/TableSearchBar'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useScreenSize } from '../../hooks/useScreensize'
import { WithHighlightPattern } from '../../components/PatternHighlightingContext'

type ProposalVotesProps = {
  isLoading: boolean
  votes: ExtendedVote[] | undefined
  rowsNumber: number
  pagination: TablePaginationProps
}

const ProposalVotes: FC<ProposalVotesProps> = ({ isLoading, votes, rowsNumber, pagination }) => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const { highlightPattern } = useVoteFiltering()

  const tableColumns: TableColProps[] = [
    { key: 'index', content: <></>, width: '50px' },
    { key: 'voter', content: t('common.voter'), align: TableCellAlign.Left },
    { key: 'vote', content: t('common.vote'), align: TableCellAlign.Right },
  ]
  const tableRows = votes?.map(vote => {
    return {
      key: `vote-${vote.index}`,
      data: [
        {
          key: 'index',
          content: `#${vote.index + 1}`,
        },
        {
          key: 'voter',
          content: (
            <WithHighlightPattern pattern={highlightPattern}>
              <DeferredValidatorLink
                network={scope.network}
                address={vote.address}
                isError={vote.haveValidatorsFailed}
                validator={vote.validator}
              />
            </WithHighlightPattern>
          ),
        },
        {
          key: 'vote',
          content: (
            <WithHighlightPattern pattern={highlightPattern}>
              <ErrorBoundary light={true}>
                <ProposalVoteIndicator vote={vote.vote as ProposalVoteValue} />
              </ErrorBoundary>
            </WithHighlightPattern>
          ),
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
      rowsNumber={rowsNumber}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}

export const ProposalVotesView: FC = () => {
  const { t } = useTranslation()
  const { network } = useRequiredScopeParam()
  const proposalId = parseInt(useParams().proposalId!, 10)

  const { clearFilters } = useVoteFiltering()
  const {
    results,
    isLoading,
    hasNoResultsOnSelectedPage,
    hasNoResultsBecauseOfFilters,
    hasNoResultsWhatsoever,
  } = useVotes(network, proposalId)

  if (hasNoResultsOnSelectedPage) throw AppErrors.PageDoesNotExist

  if (hasNoResultsBecauseOfFilters) {
    return <NoMatchingDataMaybeClearFilters clearFilters={clearFilters} />
  }

  if (hasNoResultsWhatsoever) {
    return <CardEmptyState label={t('networkProposal.thereAreNoVotes')} />
  }

  return (
    <ProposalVotes
      isLoading={isLoading}
      votes={results.data}
      rowsNumber={results.tablePaginationProps.rowsPerPage}
      pagination={results.tablePaginationProps}
    />
  )
}

export const ProposalVotesCard: FC = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useScreenSize()

  const { wantedType, setWantedType, wantedNameInput, setWantedNameInput, nameError } = useVoteFiltering()

  return (
    <SubPageCard>
      <CardHeaderWithResponsiveActions
        action={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: isTablet ? 'wrap' : 'nowrap',
              gap: 4,
              paddingRight: isMobile ? 4 : 0,
            }}
          >
            <VoteTypeFilter onSelect={setWantedType} value={wantedType} />
            <TableSearchBar
              value={wantedNameInput}
              onChange={setWantedNameInput}
              placeholder={t('networkProposal.searchForVoter')}
              warning={nameError}
              fullWidth={isTablet}
              size={'small'}
            />
          </Box>
        }
        disableTypography
        component="h2"
        title={t('common.votes')}
      />
      <ErrorBoundary light={true}>
        <Box sx={{ height: '704px' }}>
          <ProposalVotesView />
        </Box>
      </ErrorBoundary>
    </SubPageCard>
  )
}
