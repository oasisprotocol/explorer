import { FC } from 'react'
import { PercentageValue } from '../PercentageValue'

type ValidatorCommissionProps = {
  commission: number
}

export const ValidatorCommission: FC<ValidatorCommissionProps> = ({ commission }) => {
  return <PercentageValue value={commission} total={100000} />
}
