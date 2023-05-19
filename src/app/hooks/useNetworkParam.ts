import { useParams } from 'react-router-dom'
import { Network } from '../../types/network'

export const useNetworkParam = (): Network => {
  const { network } = useParams()

  return network as Network
}
