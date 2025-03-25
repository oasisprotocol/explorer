import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'

export type RoflAppDetailsContext = {
  scope: SearchScope
  id: string
}

export const useRoflAppDetailsProps = () => useOutletContext<RoflAppDetailsContext>()
