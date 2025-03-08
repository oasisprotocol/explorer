import { FC, PropsWithChildren, useState } from 'react'
import {
  LocalConfigContext,
  LocalConfigProviderContext,
  LocalConfigProviderState,
} from './LocalConfigContext'
import { storage } from '../utils/storage'
import { StorageKeys } from '../../types/storage'
import { TableAgeType } from '../../types/table-age-type'

const localStorage = storage()

const localConfigProviderInitialState: LocalConfigProviderState = {
  ageHeaderType: localStorage.get(StorageKeys.TableAgeType) ?? TableAgeType.Distance,
}

export const LocalConfigContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<LocalConfigProviderState>({
    ...localConfigProviderInitialState,
  })

  const setAgeHeaderType = (ageHeaderType: TableAgeType) => {
    setState(prevState => ({
      ...prevState,
      ageHeaderType,
    }))

    localStorage.set(StorageKeys.TableAgeType, ageHeaderType)
  }

  const providerState: LocalConfigProviderContext = {
    state,
    setAgeHeaderType,
  }

  return <LocalConfigContext.Provider value={providerState}>{children}</LocalConfigContext.Provider>
}
