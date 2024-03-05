import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'

export type ValidatorDetailsContext = {
  scope: SearchScope
  address: string
}

export const useValidatorDetailsProps = () => useOutletContext<ValidatorDetailsContext>()
