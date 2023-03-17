import { useParams } from 'react-router-dom'
import { Layer } from 'oasis-indexer/api'

export const useLayerParam = (): Layer => {
  const { layer } = useParams()

  return layer as Layer
}
