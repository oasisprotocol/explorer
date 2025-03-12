import { FC, PropsWithChildren, useState } from 'react'
import { LocalSettingsContext, LocalSettingsProviderContext } from './LocalSettingsContext'
import { storage } from '../utils/storage'
import { StorageKeys } from '../../types/storage'
import { defaultLocalSettings, LocalSettings } from '../../types/local-settings'

const localStorage = storage()

const localSettingsInitialState: LocalSettings = {
  ...defaultLocalSettings,
  ...(localStorage.get(StorageKeys.LocalSettings) ?? {}),
}

console.log('initial local settings initialized', localSettingsInitialState)

export const LocalSettingsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<LocalSettings>(localSettingsInitialState)

  const changeSetting = (key: keyof LocalSettings, value: any) => {
    setSettings(prevState => ({
      ...prevState,
      [key]: value,
    }))

    localStorage.set(StorageKeys.LocalSettings, {
      ...settings,
      [key]: value,
    })
  }

  const providerState: LocalSettingsProviderContext = {
    settings,
    changeSetting,
  }

  return <LocalSettingsContext.Provider value={providerState}>{children}</LocalSettingsContext.Provider>
}
