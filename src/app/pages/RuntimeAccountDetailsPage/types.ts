import { RuntimeScope } from '../../../types/searchScope'
import { RuntimeAccount } from '../../../oasis-nexus/api'
import { RuntimeEventFilteringType, RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

export type RuntimeAccountDetailsContext = {
  scope: RuntimeScope
  address: string
  account?: RuntimeAccount
  txMethod: RuntimeTxMethodFilteringType
  setTxMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
  eventType: RuntimeEventFilteringType
  setEventType: ParamSetterFunction<RuntimeEventFilteringType>
}
