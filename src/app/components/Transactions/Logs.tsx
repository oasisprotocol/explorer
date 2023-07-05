import React, { FC } from 'react'
import { Layer, RuntimeEvent, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { TransactionLogEvent } from './LogEvent'
import { TextSkeleton } from '../../components/Skeleton'
import { AddressSwitchOption } from '../AddressSwitch'
import { CardEmptyState } from '../../pages/AccountDetailsPage/CardEmptyState'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'

export const TransactionLogs: FC<{
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
    <TransactionLogsView
      scope={transaction}
      events={data?.data?.events}
      isLoading={isLoading}
      isError={isError}
      addressSwitchOption={addressSwitchOption}
    />
  )
}

export const TransactionLogsView: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
  isError: boolean
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, events, isLoading, isError, addressSwitchOption }) => {
  const { t } = useTranslation()
  return (
    <>
      {isError && <CardEmptyState label={t('transactionEvent.cantLoadEvents')} />}
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {events &&
        events.map((event, index) => (
          <TransactionLogEvent
            key={`event-${index}`}
            scope={scope}
            isFirst={!index}
            event={event}
            addressSwitchOption={addressSwitchOption}
          />
        ))}
    </>
  )
}
