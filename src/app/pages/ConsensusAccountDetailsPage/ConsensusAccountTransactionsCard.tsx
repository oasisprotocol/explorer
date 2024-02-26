import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ConsensusTransactions } from '../../components/Transactions'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusAccountDetailsContext } from './index'

export const consensusAccountTransactionsContainerId = 'transactions'

export const ConsensusAccountTransactionsCard: FC<ConsensusAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={consensusAccountTransactionsContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.transactions')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <ConsensusAccountTransactions scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const ConsensusAccountTransactions: FC<ConsensusAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const transactionsQuery = useGetConsensusTransactions(network, {
    limit,
    offset,
    rel: address,
  })
  const { isFetched, isLoading, data } = transactionsQuery
  const transactions = data?.data.transactions

  return (
    <>
      {isFetched && !transactions?.length && <CardEmptyState label={t('account.emptyTransactionList')} />}
      <ConsensusTransactions
        transactions={transactions}
        ownAddress={address}
        isLoading={isLoading}
        limit={limit}
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount: data?.data.total_count,
          isTotalCountClipped: data?.data.is_total_count_clipped,
          rowsPerPage: limit,
        }}
      />
    </>
  )
}
