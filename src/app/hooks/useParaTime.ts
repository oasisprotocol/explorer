import { useParams } from 'react-router-dom'
import { ParaTime } from '../../config'

export const useParaTime = () => {
  const { paraTime } = useParams()

  return {
    isCipher: paraTime === ParaTime.Cipher,
    isEmerald: paraTime === ParaTime.Emerald,
    isSapphire: paraTime === ParaTime.Sapphire,
  }
}
