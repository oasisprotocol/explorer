import { FC, PropsWithChildren, useState } from 'react'
import {
  TableConfigContext,
  TableConfigProviderContext,
  TableConfigProviderState,
} from './TableConfigContext'
import { storage } from '../utils/storage'
import { StorageKeys } from '../../types/storage'
import { TableAgeType } from '../../types/table-age-type'

const localStorage = storage()

const tableConfigProviderInitialState: TableConfigProviderState = {
  ageHeaderType: localStorage.get(StorageKeys.TableAgeType) ?? TableAgeType.Distance,
}

export const TableConfigContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<TableConfigProviderState>({
    ...tableConfigProviderInitialState,
  })

  const setAgeHeaderType = (ageHeaderType: TableAgeType) => {
    setState(prevState => ({
      ...prevState,
      ageHeaderType,
    }))

    localStorage.set(StorageKeys.TableAgeType, ageHeaderType)
  }

  const providerState: TableConfigProviderContext = {
    state,
    setAgeHeaderType,
  }

  return <TableConfigContext.Provider value={providerState}>{children}</TableConfigContext.Provider>
}
