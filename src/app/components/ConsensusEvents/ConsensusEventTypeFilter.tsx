import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsensusEventType, Layer } from '../../../oasis-nexus/api'
import { ConsensusEventFilteringType } from '../../hooks/useCommonParams'
import { TFunction } from 'i18next'
import { paraTimesConfig } from '../../../config'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { getConsensusEventTypeLabel } from './ConsensusEventDetails'
import { FilterByType } from '../FilterByType'

type Option = {
  value: ConsensusEventFilteringType
  label: string
}

const getConsensusEventTypeOptions = (t: TFunction, layer: Layer) => {
  const hasRofl = !!paraTimesConfig[layer]?.offerRoflTxTypes
  return Object.values(ConsensusEventType)
    .filter(type => !type.startsWith('rofl') || hasRofl)
    .map(
      (type): Option => ({
        value: type,
        label: getConsensusEventTypeLabel(t, type),
      }),
    )
}

export const ConsensusEventTypeFilter: FC<{
  layer: Layer
  value: ConsensusEventFilteringType
  setValue: ParamSetterFunction<ConsensusEventFilteringType>
  expand?: boolean
  customOptions?: Option[]
}> = ({ layer, value, setValue, expand, customOptions }) => {
  const { t } = useTranslation()
  const defaultOptions: Option[] = [{ value: 'any', label: 'Any' }]
  const options = customOptions
    ? [...defaultOptions, ...customOptions]
    : [...defaultOptions, ...getConsensusEventTypeOptions(t, layer)]

  return <FilterByType options={options} value={value} handleChange={setValue} />
}
