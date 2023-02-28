import { useParams } from 'react-router-dom'
import { Layer } from '../../config'

export const useParaTime = () => {
  const { paraTime } = useParams()

  return {
    isCipher: paraTime === Layer.Cipher,
    isEmerald: paraTime === Layer.Emerald,
    isSapphire: paraTime === Layer.Sapphire,
  }
}
