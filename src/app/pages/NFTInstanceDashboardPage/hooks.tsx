import { useOutletContext } from 'react-router-dom'
import { NftDashboardContext } from './types'

export const useNftDetailsProps = () => useOutletContext<NftDashboardContext>()
