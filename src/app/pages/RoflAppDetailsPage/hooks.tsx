import { SearchScope } from '../../../types/searchScope'

export type RoflAppDetailsContext = {
  scope: SearchScope
  id: string
  method: string
  setMethod: (value: string) => void
}

// TOOD: Placeholder file for a hook used within a router. Add when details page is ready
