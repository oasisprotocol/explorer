import { useOutletContext } from 'react-router-dom'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'
import { ConsensusEventFilteringType } from '../../hooks/useCommonParams'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

export type ConsensusAccountDetailsContext = {
  scope: ConsensusScope
  address: string
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: (value: ConsensusTxMethodFilterOption) => void
  eventType: ConsensusEventFilteringType
  setEventType: ParamSetterFunction<ConsensusEventFilteringType>
}

export const useConsensusAccountDetailsProps = () => useOutletContext<ConsensusAccountDetailsContext>()
