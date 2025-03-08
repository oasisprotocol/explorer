import { createContext } from 'react'
import { TableAgeType } from '../../types/table-age-type'

/**
 * This is where we store local state
 */
export interface LocalConfigProviderState {
  ageHeaderType: TableAgeType
}

export interface LocalConfigProviderContext {
  readonly state: LocalConfigProviderState
  setAgeHeaderType: (ageHeaderType: TableAgeType) => void
}

export const LocalConfigContext = createContext<LocalConfigProviderContext>({} as LocalConfigProviderContext)
