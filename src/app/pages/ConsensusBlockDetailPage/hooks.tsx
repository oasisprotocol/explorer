import { useOutletContext } from 'react-router'
import { ConsensusBlockDetailsContext } from './types'

export const useConsensusBlockDetailsProps = () => useOutletContext<ConsensusBlockDetailsContext>()
