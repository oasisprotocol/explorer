import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ConsensusTransactions } from '../../components/Transactions'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusAccountDetailsContext } from './hooks'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'

const consensusAccountTransactionsContainerId = 'transactions'

export const ConsensusAccountTransactionsCard: FC<ConsensusAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout
      containerId={consensusAccountTransactionsContainerId}
      title={t('common.transactions')}
    >
      <ConsensusAccountTransactions scope={scope} address={address} />
    </LinkableCardLayout>
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
      {isFetched && !transactions?.length && (
        <CardEmptyState label={t('account.emptyAccountTransactionList')} />
      )}
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
