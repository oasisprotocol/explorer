import { useTypedSearchParam } from './useTypedSearchParam'
import { ConsensusTxMethodFilterOption } from '../components/ConsensusTransactionMethod'

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
