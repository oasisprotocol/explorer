import { useOutletContext } from 'react-router-dom'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'

export type ValidatorDetailsContext = {
  scope: ConsensusScope
  address: string
  method: ConsensusTxMethodFilterOption
  setMethod: (method: ConsensusTxMethodFilterOption) => void
}

export const useValidatorDetailsProps = () => useOutletContext<ValidatorDetailsContext>()
