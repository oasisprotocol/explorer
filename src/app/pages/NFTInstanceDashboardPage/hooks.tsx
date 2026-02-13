import { useOutletContext } from 'react-router'
import { NftDashboardContext } from './types'

export const useNftDetailsProps = () => useOutletContext<NftDashboardContext>()
