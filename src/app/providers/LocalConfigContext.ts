import { createContext } from 'react'
import { TableAgeType } from '../../types/table-age-type'
import { SearchScope } from '../../types/searchScope'

/**
 * This is where we store local state
 */
export interface LocalConfigProviderState {
  ageHeaderType: TableAgeType
  preferredScope: SearchScope | undefined
}

export interface LocalConfigProviderContext {
  readonly state: LocalConfigProviderState
  setAgeHeaderType: (ageHeaderType: TableAgeType) => void
  setPreferredScope: (preferredScope: SearchScope) => void
}

export const LocalConfigContext = createContext<LocalConfigProviderContext>({} as LocalConfigProviderContext)
