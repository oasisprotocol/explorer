import { useOutletContext } from 'react-router-dom'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTxMethodFilterOption } from '../../components/ConsensusTransactionMethod'
import { ConsensusEventFilteringType } from '../../hooks/useCommonParams'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

export type ValidatorDetailsContext = {
  scope: ConsensusScope
  address: string
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: ParamSetterFunction<ConsensusTxMethodFilterOption>
  eventType: ConsensusEventFilteringType
  setEventType: ParamSetterFunction<ConsensusEventFilteringType>
}

export const useValidatorDetailsProps = () => useOutletContext<ValidatorDetailsContext>()
