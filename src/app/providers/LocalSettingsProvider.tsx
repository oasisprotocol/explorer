import { FC, PropsWithChildren, useState } from 'react'
import {
  LocalSettingsContext,
  LocalSettingsProviderContext,
  LocalSettingsProviderState,
} from './LocalSettingsContext'
import { storage } from '../utils/storage'
import { StorageKeys } from '../../types/storage'
import { TableAgeType } from '../../types/table-age-type'

const localStorage = storage()

const localSettingsProviderInitialState: LocalSettingsProviderState = {
  ageHeaderType: localStorage.get(StorageKeys.TableAgeType) ?? TableAgeType.Distance,
}

export const LocalSettingsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<LocalSettingsProviderState>({
    ...localSettingsProviderInitialState,
  })

  const setAgeHeaderType = (ageHeaderType: TableAgeType) => {
    setState(prevState => ({
      ...prevState,
      ageHeaderType,
    }))

    localStorage.set(StorageKeys.TableAgeType, ageHeaderType)
  }

  const providerState: LocalSettingsProviderContext = {
    state,
    setAgeHeaderType,
  }

  return <LocalSettingsContext.Provider value={providerState}>{children}</LocalSettingsContext.Provider>
}
