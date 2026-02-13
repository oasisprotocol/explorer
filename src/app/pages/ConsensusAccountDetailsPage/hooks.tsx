import { useOutletContext } from 'react-router'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'
import { ConsensusEventFilteringType } from '../../hooks/useCommonParams'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

export type ConsensusAccountDetailsContext = {
  scope: ConsensusScope
  address: string
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: ParamSetterFunction<ConsensusTxMethodFilterOption>
  eventType: ConsensusEventFilteringType
  setEventType: ParamSetterFunction<ConsensusEventFilteringType>
}

export const useConsensusAccountDetailsProps = () => useOutletContext<ConsensusAccountDetailsContext>()
