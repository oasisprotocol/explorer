import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@oasisprotocol/ui-library/src/components/select'
import Typography from '@mui/material/Typography'
import { ConsensusEventType, Layer } from '../../../oasis-nexus/api'
import { ConsensusEventFilteringType } from '../../hooks/useCommonParams'
import { TFunction } from 'i18next'
import { paraTimesConfig } from '../../../config'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { getConsensusEventTypeLabel } from './ConsensusEventDetails'

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

  return <Select options={options} value={value} handleChange={setValue} />
}
