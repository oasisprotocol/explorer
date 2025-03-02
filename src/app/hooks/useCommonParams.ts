import { useTypedSearchParam } from './useTypedSearchParam'
import { ConsensusTxMethodFilterOption } from '../components/ConsensusTransactionMethod'

export const useConsensusTxMethodParam = () => {
  const paramName = 'tx_method'
  const [method, setMethod] = useTypedSearchParam<ConsensusTxMethodFilterOption>(paramName, 'any', {
    deleteParams: ['page', 'date'],
  })
  return { paramName, method, setMethod }
}

export const useRuntimeTxMethodParam = () => {
  const paramName = 'tx_method'
  const [method, setMethod] = useTypedSearchParam(paramName, 'any', {
    deleteParams: ['page', 'date'],
  })
  return { paramName, method, setMethod }
}
