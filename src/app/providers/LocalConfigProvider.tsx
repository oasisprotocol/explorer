import { FC, PropsWithChildren, useState } from 'react'
import {
  LocalConfigContext,
  LocalConfigProviderContext,
  LocalConfigProviderState,
} from './LocalConfigContext'
import { storage } from '../utils/storage'
import { StorageKeys } from '../../types/storage'
import { TableAgeType } from '../../types/table-age-type'
import { SearchScope } from '../../types/searchScope'

const localStorage = storage()

const localConfigProviderInitialState: LocalConfigProviderState = {
  ageHeaderType: localStorage.get(StorageKeys.TableAgeType) ?? TableAgeType.Distance,
  preferredScope: localStorage.get(StorageKeys.PreferredScope),
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

  const setPreferredScope = (preferredScope: SearchScope) => {
    setState(prevState => ({
      ...prevState,
      preferredScope,
    }))

    localStorage.set(StorageKeys.PreferredScope, preferredScope)
  }

  const providerState: LocalConfigProviderContext = {
    state,
    setAgeHeaderType,
    setPreferredScope,
  }

  return <LocalConfigContext.Provider value={providerState}>{children}</LocalConfigContext.Provider>
}
