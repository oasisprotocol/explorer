import { TableAgeType } from './table-age-type'
import { SearchScope } from './searchScope'

/**
 * This is where we store local state
 */
export interface LocalSettings {
  ageHeaderType: TableAgeType
  preferredScope: SearchScope | undefined
}

export const defaultLocalSettings: LocalSettings = {
  ageHeaderType: TableAgeType.Distance,
  preferredScope: undefined,
}
