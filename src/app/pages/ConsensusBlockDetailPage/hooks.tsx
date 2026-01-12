import { useOutletContext } from 'react-router-dom'
import { ConsensusBlockDetailsContext } from './types'

export const useConsensusBlockDetailsProps = () => useOutletContext<ConsensusBlockDetailsContext>()
