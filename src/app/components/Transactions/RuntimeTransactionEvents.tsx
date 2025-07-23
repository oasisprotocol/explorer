import { FC } from 'react'
import { RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { RuntimeEventsDetailedList } from '../RuntimeEvents/RuntimeEventsDetailedList'
import { getRuntimeEventTypeFilteringParam, RuntimeEventFilteringType } from '../../hooks/useCommonParams'

export const RuntimeTransactionEvents: FC<{
  transaction: RuntimeTransaction
  eventType: RuntimeEventFilteringType
}> = ({ transaction, eventType }) => {
  const { network, layer } = transaction
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetRuntimeEvents(network, layer, {
    tx_hash: transaction.hash,
    limit,
    offset,
    ...getRuntimeEventTypeFilteringParam(eventType),
  })
  const { isLoading, data, isError } = eventsQuery
  const events = data?.data.events

  return (
    <RuntimeEventsDetailedList
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
