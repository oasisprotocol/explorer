import { FC } from 'react'
import { getRuntimeTxMethodOptions, RuntimeTxMethodFilterOption } from '../RuntimeTransactionMethod'
import { useTranslation } from 'react-i18next'
import { Layer } from '../../../oasis-nexus/api'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'
import { FilterByType } from '../FilterByType'

export const RuntimeTransactionMethodFilter: FC<{
  layer: Layer
  value: RuntimeTxMethodFilteringType
  setValue: ParamSetterFunction<RuntimeTxMethodFilteringType>
  expand?: boolean
  customOptions?: RuntimeTxMethodFilterOption[]
}> = ({ layer, value, setValue, expand, customOptions }) => {
  const { t } = useTranslation()
  const defaultOptions: RuntimeTxMethodFilterOption[] = [{ value: 'any', label: 'Any' }]
  const options = customOptions
    ? [...defaultOptions, ...customOptions]
    : [...defaultOptions, ...getRuntimeTxMethodOptions(t, layer)]

  return <FilterByType options={options} value={value} handleChange={setValue} />
}
