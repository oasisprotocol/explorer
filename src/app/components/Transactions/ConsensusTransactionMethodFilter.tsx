import { FC } from 'react'
import { getConsensusTxMethodOptions, ConsensusTxMethodFilterOption } from '../ConsensusTransactionMethod'
import { useTranslation } from 'react-i18next'
import { Select } from '@oasisprotocol/ui-library/src/components/select'
import Typography from '@mui/material/Typography'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

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

export const ConsensusTransactionMethodFilter: FC<{
  value: ConsensusTxMethodFilterOption
  setValue: ParamSetterFunction<ConsensusTxMethodFilterOption>
  expand?: boolean
}> = ({ value, setValue, expand }) => {
  const { t } = useTranslation()
  return (
    <Select
      options={[{ value: 'any', label: 'Any' }, ...getConsensusTxMethodOptions(t)]}
      value={value}
      handleChange={setValue}
    />
  )
}
