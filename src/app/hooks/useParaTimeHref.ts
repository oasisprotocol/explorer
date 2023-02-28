import { useHref } from 'react-router-dom'
import { ParaTime } from '../../config'
import { useParaTimeLocation } from './useParaTimeLocation'

export const useParaTimeHref = (href: string = '', paraTime?: ParaTime): ReturnType<typeof useHref> => {
  const { isEmerald, isSapphire, isCipher } = useParaTimeLocation()

  const getParaTime = () => {
    if (!href.startsWith('/')) {
      return ''
    }

    if (paraTime) {
      return `/${paraTime}`
    }

    if (isEmerald) {
      return `/${ParaTime.Emerald}`
    }

    if (isSapphire) {
      return `/${ParaTime.Sapphire}`
    }

    if (isCipher) {
      return `/${ParaTime.Cipher}`
    }

    return ''
  }

  return useHref(`${getParaTime()}${href}`)
}
