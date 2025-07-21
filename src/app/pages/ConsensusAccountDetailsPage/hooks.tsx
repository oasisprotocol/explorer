import { useOutletContext } from 'react-router-dom'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'

export type ConsensusAccountDetailsContext = {
  scope: ConsensusScope
  address: string
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: (value: ConsensusTxMethodFilterOption) => void
}

export const useConsensusAccountDetailsProps = () => useOutletContext<ConsensusAccountDetailsContext>()
