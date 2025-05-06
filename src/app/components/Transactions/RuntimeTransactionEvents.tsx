import { FC } from 'react'
import { Layer, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { useSearchParamsPagination } from '../Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { RuntimeEventsDetailedList } from '../RuntimeEvents/RuntimeEventsDetailedList'

export const RuntimeTransactionEvents: FC<{
  transaction: RuntimeTransaction
}> = ({ transaction }) => {
  const { network, layer } = transaction
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const eventsQuery = useGetRuntimeEvents(network, layer, {
    tx_hash: transaction.hash,
    limit,
    offset,
  })
  const { isFetched, isLoading, data, isError } = eventsQuery
  const events = data?.data.events
  if (isFetched && pagination.selectedPage > 1 && !events?.length) {
    throw AppErrors.PageDoesNotExist
  }

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
    />
  )
}
