import { useTypedSearchParam } from './useTypedSearchParam'
import { ConsensusTxMethodFilterOption } from '../components/ConsensusTransactionMethod'

export const METHOD_QUERY_ARG_NAME = 'tx_method'

export const useConsensusTxMethodParam = () => {
  const [method, setMethod] = useTypedSearchParam<ConsensusTxMethodFilterOption>(
    METHOD_QUERY_ARG_NAME,
    'any',
    {
      deleteParams: ['page', 'date'],
    },
  )
  return { method, setMethod }
}

export const useRuntimeTxMethodParam = () => {
  const [method, setMethod] = useTypedSearchParam(METHOD_QUERY_ARG_NAME, 'any', {
    deleteParams: ['page', 'date'],
  })
  return { method, setMethod }
}
