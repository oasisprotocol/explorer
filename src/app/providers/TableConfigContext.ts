import { createContext } from 'react'
import { TableAgeType } from '../../types/table-age-type'

export interface TableConfigProviderState {
  ageHeaderType: TableAgeType
}

export interface TableConfigProviderContext {
  readonly state: TableConfigProviderState
  setAgeHeaderType: (ageHeaderType: TableAgeType) => void
}

export const TableConfigContext = createContext<TableConfigProviderContext>({} as TableConfigProviderContext)
