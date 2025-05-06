import { Network } from '../../types/network'
import { Account, Address, Layer, Runtime, RuntimeAccount } from '../../oasis-nexus/api'

export type AccountMetadataSource = 'OasisRegistry' | 'DeltaDaoRegistry' | 'SelfProfessed'

export type AccountMetadata = {
  address: Address
  name?: string
  description?: string
  icon?: string // Sanitized URL
  origin?: string // Origin of this token/account
  source: AccountMetadataSource // Origin of metadata. TODO: rename to e.g. metadata_source
  dapp?: {
    button: string
    description: string
    url: string
  }
}

export type AccountMetadataInfo = {
  metadata?: AccountMetadata
  isLoading: boolean
  isError: boolean
}

export type AccountMap = Map<Address, AccountMetadata>

export type AccountData = {
  map: AccountMap
  list: AccountMetadata[]
}

export type AccountNameSearchMatch = {
  network: Network
  layer: Layer
  address: Address
}

export type AccountNameSearchRuntimeMatch = {
  network: Network
  layer: Runtime
  address: Address
}

export type AccountNameSearchConsensusMatch = {
  network: Network
  layer: typeof Layer.consensus
  address: Address
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
