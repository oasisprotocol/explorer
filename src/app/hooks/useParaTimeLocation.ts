import { useLocation } from 'react-router-dom'
import { ParaTime } from '../../config'

export const useParaTimeLocation = () => {
  const { pathname } = useLocation()

  return {
    isEmerald: new RegExp(`^(/${ParaTime.Emerald})(/)?`).test(pathname),
    isSapphire: new RegExp(`^(/${ParaTime.Sapphire})(/)?`).test(pathname),
    isCipher: new RegExp(`^(/${ParaTime.Cipher})(/)?`).test(pathname),
  }
}
