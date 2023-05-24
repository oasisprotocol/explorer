import { Network } from './network'
import { Layer } from '../oasis-indexer/api'

export interface SearchScope {
  network: Network
  layer: Layer
}
