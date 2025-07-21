import { useTypedSearchParam } from './useTypedSearchParam'
import { ConsensusTxMethodFilterOption } from '../components/ConsensusTransactionMethod'
import { GetRuntimeEventsParams, RuntimeEventType } from '../../oasis-nexus/api'

export const TX_METHOD_QUERY_ARG_NAME = 'tx_method'

export const useConsensusTxMethodParam = () => {
  const [txMethod, setTxMethod] = useTypedSearchParam<ConsensusTxMethodFilterOption>(
    TX_METHOD_QUERY_ARG_NAME,
    'any',
    {
      deleteParams: ['page', 'date'],
    },
  )
  return { txMethod, setTxMethod }
}

export const useRuntimeTxMethodParam = () => {
  const [txMethod, setTxMethod] = useTypedSearchParam(TX_METHOD_QUERY_ARG_NAME, 'any', {
    deleteParams: ['page', 'date'],
  })
  return { txMethod, setTxMethod }
}

export type RuntimeEventFilteringType = RuntimeEventType | 'erc20transfer' | 'any'

export const EVENT_TYPE_QUERY_ARG_NAME = 'event_type'

export const useRuntimeEventTypeParam = () => {
  const [eventType, setEventType] = useTypedSearchParam<RuntimeEventFilteringType>(
    EVENT_TYPE_QUERY_ARG_NAME,
    'any',
    {
      deleteParams: ['page', 'date'],
    },
  )
  return { eventType, setEventType }
}

export const getRuntimeEventTypeFilteringParam = (
  type: RuntimeEventFilteringType,
): Partial<GetRuntimeEventsParams> => {
  switch (type) {
    case 'any':
      return {}
    case 'erc20transfer':
      return {
        type: RuntimeEventType.evmlog,
        evm_log_signature: 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      }
    default:
      return { type }
  }
}
