import { useOutletContext } from 'react-router-dom'
import { SearchScope } from '../../../types/searchScope'

export type ConsensusAccountDetailsContext = {
  scope: SearchScope
  address: string
}

export const useConsensusAccountDetailsProps = () => useOutletContext<ConsensusAccountDetailsContext>()
