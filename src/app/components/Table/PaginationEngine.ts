import { To } from 'react-router-dom'

export interface SimplePaginationEngine {
  selectedPage: number
  linkToPage: (pageNumber: number) => To
}
