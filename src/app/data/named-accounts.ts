import { Network } from '../../types/network'
import { Account, Layer, Runtime, RuntimeAccount } from '../../oasis-nexus/api'

export type AccountMetadata = {
  address: string
  name?: string
  description?: string
}

export type AccountMetadataInfo = {
  metadata?: AccountMetadata
  isLoading: boolean
  isError: boolean
}

export type AccountMap = Map<string, AccountMetadata>

export type AccountData = {
  map: AccountMap
  list: AccountMetadata[]
}

export type AccountNameSearchMatch = {
  network: Network
  layer: Layer
  address: string
}

export type AccountNameSearchRuntimeMatch = {
  network: Network
  layer: Runtime
  address: string
}

export type AccountNameSearchConsensusMatch = {
  network: Network
  layer: typeof Layer.consensus
  address: string
}

export type AccountNameSearchResults = {
  results: (Account | RuntimeAccount)[] | undefined
  isLoading: boolean
  isError: boolean
}

export type AccountNameSearchRuntimeResults = {
  results: RuntimeAccount[] | undefined
  isLoading: boolean
  isError: boolean
}
