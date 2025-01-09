import { FC } from 'react'
import { getRuntimeTxMethodOptions } from '../RuntimeTransactionMethod'
import { useTranslation } from 'react-i18next'
import { Select } from '../Select'
import Typography from '@mui/material/Typography'

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
  value: string
  setValue: (value: string) => void
  expand?: boolean
}> = ({ value, setValue, expand }) => {
  const { t } = useTranslation()
  return (
    <Select
      className={expand ? 'expand' : undefined}
      light={true}
      label={<FilterLabel />}
      options={[{ value: 'any', label: 'Any' }, ...getRuntimeTxMethodOptions(t)]}
      defaultValue={value}
      handleChange={setValue as any}
    />
  )
}
