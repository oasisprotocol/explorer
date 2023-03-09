import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import {
  isValidBlockHeight,
  isValidBlockHash,
  isValidTxHash,
  isValidOasisAddress,
  isValidEthAddress,
  getEvmBech32Address,
} from '../../utils/helpers'

export const searchSuggestionTerms = {
  suggestedTransaction: 'b1e68ca814d913064bd6b9460efcb64b4c6d07f3b98fa659beed46164398a830',
  suggestedBlock: '1396255',
  suggestedAccount: '0xBA504818FdD8D3dBA2Ef8fD9B4F4D5c71aD1d1D3',
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

export const searchParamLoader = async ({ request }: LoaderFunctionArgs) => {
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
