import { useContext } from 'react'
import { LocalSettingsContext } from '../providers/LocalSettingsContext'

export const useLocalSettings = () => {
  const value = useContext(LocalSettingsContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useLocalSettings] Component not wrapped within a Provider')
  }

  return value
}
