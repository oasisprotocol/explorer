import { useContext } from 'react'
import { LocalConfigContext } from '../providers/LocalConfigContext'

export const useLocalConfig = () => {
  const value = useContext(LocalConfigContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useLocalConfig] Component not wrapped within a Provider')
  }

  return value
}
