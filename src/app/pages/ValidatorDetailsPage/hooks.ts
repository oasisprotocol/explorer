import { useOutletContext } from 'react-router-dom'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'

export type ValidatorDetailsContext = {
  scope: ConsensusScope
  address: string
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: (method: ConsensusTxMethodFilterOption) => void
}

export const useValidatorDetailsProps = () => useOutletContext<ValidatorDetailsContext>()
