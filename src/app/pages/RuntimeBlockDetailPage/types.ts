import { RuntimeScope } from '../../../types/searchScope'
import { RuntimeEventFilteringType, RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

export type RuntimeBlockDetailsContext = {
  scope: RuntimeScope
  blockHeight?: number
  txMethod: RuntimeTxMethodFilteringType
  setTxMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
  eventType: RuntimeEventFilteringType
  setEventType: ParamSetterFunction<RuntimeEventFilteringType>
}
