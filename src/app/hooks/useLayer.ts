import { Layer } from '../../config'
import { useParams } from 'react-router-dom'

export const useLayer = (): Layer => {
  const { layer } = useParams()

  return layer as Layer
}
