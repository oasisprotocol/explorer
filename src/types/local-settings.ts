import { TableAgeType } from './table-age-type'
import { NodeDisplayType } from './node-display-type'
import { SearchScope } from './searchScope'

/**
 * This is where we store local state
 */
export interface LocalSettings {
  ageHeaderType: TableAgeType
  nodeHeaderType: NodeDisplayType
  preferredScope: SearchScope | undefined
}

export const defaultLocalSettings: LocalSettings = {
  ageHeaderType: TableAgeType.Distance,
  nodeHeaderType: NodeDisplayType.Id,
  preferredScope: undefined,
}
