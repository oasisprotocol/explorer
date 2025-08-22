import { FC } from 'react'
import { getConsensusTxMethodOptions, ConsensusTxMethodFilterOption } from '../ConsensusTransactionMethod'
import { useTranslation } from 'react-i18next'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { FilterByType } from '../FilterByType'

export const ConsensusTransactionMethodFilter: FC<{
  value: ConsensusTxMethodFilterOption
  setValue: ParamSetterFunction<ConsensusTxMethodFilterOption>
  expand?: boolean
}> = ({ value, setValue, expand }) => {
  const { t } = useTranslation()
  return (
    <FilterByType
      options={[{ value: 'any', label: 'Any' }, ...getConsensusTxMethodOptions(t)]}
      value={value}
      handleChange={setValue}
    />
  )
}
