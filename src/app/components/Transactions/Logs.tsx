import React from 'react'
import { FC } from 'react'
import { Layer, RuntimeEvent, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-indexer/api'
import { AppErrors } from '../../../types/errors'
import { TransactionLogEvent } from './LogEvent'
import { TextSkeleton } from '../../components/Skeleton'
import { SearchScope } from '../../../types/searchScope'

export const TransactionLogs: FC<{
  transaction: RuntimeTransaction
}> = ({ transaction }) => {
  const { layer } = transaction
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const eventsQuery = useGetRuntimeEvents(layer, {
    tx_hash: transaction.hash,
    limit: 100, // We want to avoid pagination here, if possible
  })
  const { isLoading, data } = eventsQuery
  return <TransactionLogsView scope={transaction} events={data?.data?.events} isLoading={isLoading} />
}

export const TransactionLogsView: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
}> = ({ scope, events, isLoading }) => {
  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {events &&
        events.map((event, index) => (
          <TransactionLogEvent key={`event-${index}`} scope={scope} isFirst={!index} event={event} />
        ))}
    </>
  )
}
