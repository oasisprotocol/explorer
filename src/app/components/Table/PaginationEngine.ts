import { To } from 'react-router-dom'

export interface SimplePaginationEngine {
  selectedPage: number
  linkToPage: (pageNumber: number) => To
}

export interface ComprehensivePaginationEngine {
  selectedPage: number
  linkToPage: (pageNumber: number) => To
}
