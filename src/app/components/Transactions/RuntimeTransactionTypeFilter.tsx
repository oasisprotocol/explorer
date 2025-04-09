import { FC } from 'react'
import { getRuntimeTxMethodOptions } from '../RuntimeTransactionMethod'
import { useTranslation } from 'react-i18next'
import { Select, SelectOptionBase } from '../Select'
import Typography from '@mui/material/Typography'
import { Layer } from '../../../oasis-nexus/api'

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
      {t('transactions.filterByType')}
    </Typography>
  )
}

export const RuntimeTransactionTypeFilter: FC<{
  layer: Layer
  value: string
  setValue: (value: string) => void
  expand?: boolean
  customOptions?: SelectOptionBase[]
}> = ({ layer, value, setValue, expand, customOptions }) => {
  const { t } = useTranslation()
  const defaultOptions = [{ value: 'any', label: 'Any' }]
  const options = customOptions
    ? [...defaultOptions, ...customOptions]
    : [...defaultOptions, ...getRuntimeTxMethodOptions(t, layer)]

  return (
    <Select
      className={expand ? 'expand' : undefined}
      light={true}
      label={<FilterLabel />}
      options={options}
      value={value}
      handleChange={setValue as any}
    />
  )
}
