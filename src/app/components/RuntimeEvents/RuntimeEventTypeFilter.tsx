import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@oasisprotocol/ui-library/src/components/select'
import Typography from '@mui/material/Typography'
import { Layer, RuntimeEventType } from '../../../oasis-nexus/api'
import { RuntimeEventFilteringType } from '../../hooks/useCommonParams'
import { TFunction } from 'i18next'
import { paraTimesConfig } from '../../../config'
import { getRuntimeEventMethodLabel } from './RuntimeEventDetails'

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

const FilterLabel: FC = () => {
  const { t } = useTranslation()
  return (
    <Typography
      component={'span'}
      sx={{
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: 16,
        lineHeight: '150%',
        marginRight: 4,
      }}
    >
      {t('event.filterByType')}
    </Typography>
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

  return <Select options={options} value={value} handleChange={setValue} />
}
