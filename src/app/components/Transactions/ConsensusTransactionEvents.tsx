import { FC } from 'react'
import { Transaction, useGetConsensusEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { ConsensusEventsList } from '../ConsensusEvents/ConsensusEventsList'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { ConsensusEventFilteringType, getConsensusEventTypeFilteringParam } from '../../hooks/useCommonParams'

export const ConsensusTransactionEvents: FC<{
  transaction: Transaction
  eventType: ConsensusEventFilteringType
}> = ({ transaction, eventType }) => {
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetConsensusEvents(transaction.network, {
    tx_hash: transaction.hash,
    ...getConsensusEventTypeFilteringParam(eventType),
    limit,
    offset,
  })
  const { isLoading, data, isError } = eventsQuery
  const events = data?.data.events
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
      filtered={eventType !== 'any'}
    />
  )
}
