import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'

export type ConsensusAccountDetailsContext = {
  scope: SearchScope
  address: string
  method: ConsensusTxMethodFilterOption
  setMethod: (value: ConsensusTxMethodFilterOption) => void
}

export const useConsensusAccountDetailsProps = () => useOutletContext<ConsensusAccountDetailsContext>()
