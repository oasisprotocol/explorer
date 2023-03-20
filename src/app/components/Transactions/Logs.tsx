import React from 'react'
import { FC } from 'react'
import { Layer, RuntimeEvent, RuntimeTransaction, useGetRuntimeEvents } from '../../../oasis-indexer/api'
import { AppErrors } from '../../../types/errors'
import { TransactionLogEvent } from './LogEvent'
import { TextSkeleton } from '../../components/Skeleton'

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
  return <TransactionLogsView layer={transaction.layer} events={data?.data?.events} isLoading={isLoading} />
}

export const TransactionLogsView: FC<{
  layer: Layer
  events: RuntimeEvent[] | undefined
  isLoading: boolean
}> = ({ layer, events, isLoading }) => {
  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {events &&
        events.map((event, index) => (
          <TransactionLogEvent key={`event-${index}`} layer={layer} isFirst={!index} event={event} />
        ))}
    </>
  )
}
