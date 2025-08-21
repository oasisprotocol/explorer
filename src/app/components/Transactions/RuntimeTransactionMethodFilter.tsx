import { FC } from 'react'
import { getRuntimeTxMethodOptions, RuntimeTxMethodFilterOption } from '../RuntimeTransactionMethod'
import { useTranslation } from 'react-i18next'
import { Select } from '@oasisprotocol/ui-library/src/components/select'
import Typography from '@mui/material/Typography'
import { Layer } from '../../../oasis-nexus/api'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'

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
      {t('transactions.filterByMethod')}
    </Typography>
  )
}

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

  return <Select options={options} value={value} handleChange={setValue} />
}
