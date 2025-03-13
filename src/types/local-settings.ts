import { TableAgeType } from './table-age-type'

/**
 * This is where we store local state
 */
export interface LocalSettings {
  ageHeaderType: TableAgeType
}

export const defaultLocalSettings: LocalSettings = {
  ageHeaderType: TableAgeType.Distance,
}
