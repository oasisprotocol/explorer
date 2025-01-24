import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'

export type ValidatorDetailsContext = {
  scope: SearchScope
  address: string
  method: ConsensusTxMethodFilterOption
  setMethod: (method: ConsensusTxMethodFilterOption) => void
}

export const useValidatorDetailsProps = () => useOutletContext<ValidatorDetailsContext>()
