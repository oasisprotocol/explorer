import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, RuntimeEventType } from '../../../oasis-nexus/api'
import { RuntimeEventFilteringType } from '../../hooks/useCommonParams'
import { TFunction } from 'i18next'
import { paraTimesConfig } from '../../../config'
import { getRuntimeEventMethodLabel } from './helpers'
import { FilterByType } from '../FilterByType'

type RuntimeEventTypeFilterOption = { value: RuntimeEventFilteringType; label: string }

const getRuntimeEventTypeOptions = (t: TFunction, layer: Layer) => {
  const hasRofl = !!paraTimesConfig[layer]?.offerRoflTxTypes
  return Object.values(RuntimeEventType)
    .filter(type => !type.startsWith('rofl') || hasRofl)
    .map(
      (type): RuntimeEventTypeFilterOption => ({
        value: type,
        label: getRuntimeEventMethodLabel(t, type),
      }),
    )
}

export const RuntimeEventTypeFilter: FC<{
  layer: Layer
  value: RuntimeEventFilteringType
  setValue: (value: RuntimeEventFilteringType | null) => void
  expand?: boolean
  customOptions?: RuntimeEventTypeFilterOption[]
}> = ({ layer, value, setValue, expand, customOptions }) => {
  const { t } = useTranslation()
  const defaultOptions: RuntimeEventTypeFilterOption[] = [
    { value: 'any', label: 'Any' },
    { value: 'erc20transfer', label: t('tokens.transferEventType.erc20Transfer') },
  ]
  const options = customOptions
    ? [...defaultOptions, ...customOptions]
    : [...defaultOptions, ...getRuntimeEventTypeOptions(t, layer)]

  return <FilterByType options={options} value={value} handleChange={setValue} />
}
