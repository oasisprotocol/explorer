import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Transaction, useGetConsensusEvents } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { ConsensusEventsList } from '../ConsensusEvents/ConsensusEventsList'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { EmptyState } from '../EmptyState'

export const ConsensusTransactionEvents: FC<{
  transaction: Transaction
}> = ({ transaction }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetConsensusEvents(transaction.network, {
    tx_hash: transaction.hash,
    limit,
    offset,
  })
  const { isFetched, isLoading, data, isError } = eventsQuery
  const events = data?.data.events
  if (isFetched && pagination.selectedPage > 1 && !events?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (!events?.length && isFetched) {
    return (
      <EmptyState description={t('event.cantFindMatchingEvents')} title={t('event.noEvents')} light={true} />
    )
  }

  return (
    <ConsensusEventsList
      scope={transaction}
      events={events}
      isLoading={isLoading}
      isError={isError}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
      showTxHash={false}
    />
  )
}
