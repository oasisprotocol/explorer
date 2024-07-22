import { FC } from 'react'
import { Layer, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { AddressSwitchOption } from '../AddressSwitch'
import { RuntimeEventsDetailedList } from '../RuntimeEvents/RuntimeEventsDetailedList'

export const TransactionEvents: FC<{
  transaction: RuntimeTransaction
  addressSwitchOption: AddressSwitchOption
}> = ({ transaction, addressSwitchOption }) => {
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
  const { isLoading, data, isError } = eventsQuery
  return (
    <RuntimeEventsDetailedList
      scope={transaction}
      events={data?.data?.events}
      isLoading={isLoading}
      isError={isError}
      addressSwitchOption={addressSwitchOption}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
    />
  )
}
