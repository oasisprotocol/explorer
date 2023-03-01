import { useParams } from 'react-router-dom'
import { Layer } from '../../config'

export const useLayer = () => {
  const { layer } = useParams()

  return {
    isCipher: layer === Layer.Cipher,
    isEmerald: layer === Layer.Emerald,
    isSapphire: layer === Layer.Sapphire,
  }
}
