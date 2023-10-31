import { FC } from 'react'
import { Layer, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { AddressSwitchOption } from '../AddressSwitch'
import { RuntimeEventsDetailedList } from '../RuntimeEvents/RuntimeEventsDetailedList'

export const TransactionEvents: FC<{
  transaction: RuntimeTransaction
  addressSwitchOption: AddressSwitchOption
}> = ({ transaction, addressSwitchOption }) => {
  const { network, layer } = transaction
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const eventsQuery = useGetRuntimeEvents(network, layer, {
    tx_hash: transaction.hash,
    limit: 100, // We want to avoid pagination here, if possible
  })
  const { isLoading, data, isError } = eventsQuery
  return (
    <RuntimeEventsDetailedList
      scope={transaction}
      events={data?.data?.events}
      isLoading={isLoading}
      isError={isError}
      addressSwitchOption={addressSwitchOption}
    />
  )
}
