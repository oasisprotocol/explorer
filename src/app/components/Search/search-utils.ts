import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import {
  isValidBlockHeight,
  isValidBlockHash,
  isValidTxHash,
  isValidOasisAddress,
  isValidEthAddress,
  getEvmBech32Address,
} from '../../utils/helpers'
import { Network } from '../../../types/network'
import { RouteUtils } from '../../utils/route-utils'
import { AppError, AppErrors } from '../../../types/errors'
import { Layer } from '../../../oasis-nexus/api'

type LayerSuggestions = {
  suggestedBlock: string
  suggestedTransaction: string
  suggestedAccount: string
}

export const searchSuggestionTerms: Record<Network, Partial<Record<Layer, LayerSuggestions>>> = {
  mainnet: {
    emerald: {
      suggestedBlock: '4260',
      suggestedTransaction: '0x2f461f83745e1fa1177138aa815e210e1c69305db8065af9015b2e490a5033f1',
      suggestedAccount: '0x0266562AB0aE2a80C14373029a70F73A9A3dB9d3',
    },
    sapphire: {
      suggestedBlock: '4260',
      suggestedTransaction: '0x5900415a3fbb39325d5dfe145d1eccd1586a2afe12a204de34ecac0c808ac3f7',
      suggestedAccount: '0x90adE3B7065fa715c7a150313877dF1d33e777D5',
    },
  },
  testnet: {
    sapphire: {
      suggestedBlock: '4260',
      suggestedTransaction: '0xd9b5c08be1cb74229abedd9b3e1afb8b43228085a6abf72993db415959ab6b35',
      suggestedAccount: '0xfA3AC9f65C9D75EE3978ab76c6a1105f03156204',
    },
  },
}

export const validateAndNormalize = {
  blockHeight: (searchTerm: string) => {
    // Remove localized digit group separators
    if (isValidBlockHeight(searchTerm.replaceAll(/[^0-9a-zA-Z]/g, ''))) {
      return searchTerm.replaceAll(/[^0-9a-zA-Z]/g, '')
    }
  },
  blockHash: (searchTerm: string) => {
    if (isValidBlockHash(searchTerm.toLowerCase().replace('0x', ''))) {
      return searchTerm.toLowerCase().replace('0x', '')
    }
    if (isValidBlockHash(searchTerm.toLowerCase())) {
      return searchTerm.toLowerCase()
    }
  },

  // TODO: do we need to differentiate between consensus and evm hashes?
  // TODO: normalize to 0x prefix for evm?
  txHash: (searchTerm: string) => {
    if (isValidTxHash(searchTerm.toLowerCase().replace('0x', ''))) {
      return searchTerm.toLowerCase().replace('0x', '')
    }
    if (isValidTxHash(searchTerm.toLowerCase())) {
      return searchTerm.toLowerCase()
    }
  },

  consensusAccount: (searchTerm: string) => {
    if (isValidOasisAddress(searchTerm.replace(/\s/g, '').toLowerCase())) {
      return searchTerm.replace(/\s/g, '').toLowerCase()
    }
  },
  evmAccount: (searchTerm: string) => {
    if (isValidEthAddress(`0x${searchTerm}`)) {
      return `0x${searchTerm.toLowerCase()}`
    }
    if (isValidEthAddress(searchTerm)) {
      return searchTerm.toLowerCase()
    }
  },
} satisfies { [name: string]: (searchTerm: string) => string | undefined }

export function isSearchValid(searchTerm: string) {
  return Object.values(validateAndNormalize).some(fn => !!fn(searchTerm))
}

export const searchParamLoader = async ({ request, params }: LoaderFunctionArgs) => {
  const { network } = params
  if (!!network && !RouteUtils.getEnabledNetworks().includes(network as Network)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  const searchTerm = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  const normalized = Object.fromEntries(
    Object.entries(validateAndNormalize).map(([key, fn]) => [key, fn(searchTerm)]),
  ) as { [Key in keyof typeof validateAndNormalize]: string | undefined }
  return {
    ...normalized,
    // TODO: remove conversion when API supports querying by EVM address
    // TODO: without async conversion, this won't need to even be a loader
    evmBech32Account: normalized.evmAccount ? await getEvmBech32Address(normalized.evmAccount) : undefined,
  }
}

export const useParamSearch = () => {
  return useLoaderData() as Awaited<ReturnType<typeof searchParamLoader>>
}

export type SearchParams = ReturnType<typeof useParamSearch>
