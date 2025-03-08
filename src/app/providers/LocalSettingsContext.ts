import { createContext } from 'react'
import { TableAgeType } from '../../types/table-age-type'

/**
 * This is where we store local state
 */
export interface LocalSettingsProviderState {
  ageHeaderType: TableAgeType
}

export interface LocalSettingsProviderContext {
  readonly state: LocalSettingsProviderState
  setAgeHeaderType: (ageHeaderType: TableAgeType) => void
}

export const LocalSettingsContext = createContext<LocalSettingsProviderContext>(
  {} as LocalSettingsProviderContext,
)
