import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'

export type RoflAppInstanceDetailsContext = {
  scope: SearchScope
  id: string
  rak: string
  method: string
  setMethod: (value: string) => void
}

export const useRoflAppInstanceDetailsProps = () => useOutletContext<RoflAppInstanceDetailsContext>()
