import { useSearchParams } from 'react-router-dom'
import {
  isValidBlockHeight,
  isValidBlockHash,
  isValidTxHash,
  isValidOasisAddress,
  isValidEthAddress,
  isValidRoflAppId,
  uniq,
} from '../../utils/helpers'
import { RouteUtils, SpecifiedPerEnabledLayer } from '../../utils/route-utils'
import { AppError, AppErrors } from '../../../types/errors'
import { useNetworkParam } from '../../hooks/useScopeParam'
import { TFunction } from 'i18next'
import { HighlightPattern } from '../HighlightedText'

type LayerSuggestions = {
  suggestedBlock: string
  suggestedTransaction: string
  suggestedAccount: string
  suggestedTokenFragment: string
}

export const searchSuggestionTerms = {
  mainnet: {
    emerald: {
      suggestedBlock: '4260',
      suggestedTransaction: '0x2f461f83745e1fa1177138aa815e210e1c69305db8065af9015b2e490a5033f1',
      suggestedAccount: '0x0266562AB0aE2a80C14373029a70F73A9A3dB9d3',
      suggestedTokenFragment: 'yuzu',
    },
    sapphire: {
      suggestedBlock: '4260',
      suggestedTransaction: '0x5900415a3fbb39325d5dfe145d1eccd1586a2afe12a204de34ecac0c808ac3f7',
      suggestedAccount: '0x90adE3B7065fa715c7a150313877dF1d33e777D5',
      suggestedTokenFragment: 'mock',
    },
    cipher: undefined,
    pontusxdev: undefined,
    pontusxtest: undefined,
    consensus: {
      suggestedBlock: '22420882',
      suggestedTransaction: 'b6770d61a2810896942f2dde54ac23a414672c3465e123abb29bdb7367dcb482',
      suggestedAccount: 'oasis1qrmufhkkyyf79s5za2r8yga9gnk4t446dcy3a5zm',
      suggestedTokenFragment: '',
    },
  },
  testnet: {
    emerald: {
      suggestedBlock: '1398623', // The prod testnet deploy only started processing blocks from round 1398623.
      suggestedTransaction: '0x7b118fadc9e6569b933edf3a9b8c442eb145fc22613bc11111b8aeb223d4e271',
      suggestedAccount: '0x6d5A9A4C063b840ef3fe792E5DD6232fbf2c0982',
      suggestedTokenFragment: 'yuzu', // Not available until a full reindex with all analyzers is done.
    },
    sapphire: {
      suggestedBlock: '4260',
      suggestedTransaction: '0xd9b5c08be1cb74229abedd9b3e1afb8b43228085a6abf72993db415959ab6b35',
      suggestedAccount: '0xfA3AC9f65C9D75EE3978ab76c6a1105f03156204',
      suggestedTokenFragment: 'USD',
    },
    cipher: undefined,
    pontusxdev: {
      suggestedBlock: '390632',
      suggestedTransaction: '0x244f71bcc67a0359c0d1e417b302ec3b358193769399e71f0112c58135f0fc82',
      suggestedAccount: '0xC09c6A1d5538E7ed135d6146241c8da11e92130B',
      suggestedTokenFragment: 'Ocean',
    },
    pontusxtest: {
      suggestedBlock: '390632', // TODO
      suggestedTransaction: '0x244f71bcc67a0359c0d1e417b302ec3b358193769399e71f0112c58135f0fc82', // TODO
      suggestedAccount: '0xC09c6A1d5538E7ed135d6146241c8da11e92130B', // TODO
      suggestedTokenFragment: 'Ocean', // TODO
    },
    consensus: {
      suggestedBlock: '22420882',
      suggestedTransaction: 'a5bb1ffedee431372d63a41774028e86203b2337d3aa408f2f7c707ec92071e5',
      suggestedAccount: 'oasis1qrmufhkkyyf79s5za2r8yga9gnk4t446dcy3a5zm',
      suggestedTokenFragment: '',
    },
  },
  localnet: {
    emerald: {
      suggestedBlock: '',
      suggestedTransaction: '',
      suggestedAccount: '',
      suggestedTokenFragment: '',
    },
    sapphire: {
      suggestedBlock: '',
      suggestedTransaction: '',
      suggestedAccount: '',
      suggestedTokenFragment: '',
    },
    cipher: undefined,
    pontusxdev: undefined,
    pontusxtest: undefined,
    consensus: {
      suggestedBlock: '',
      suggestedTransaction: '',
      suggestedAccount: '',
      suggestedTokenFragment: '',
    },
  },
} satisfies SpecifiedPerEnabledLayer<LayerSuggestions>

export type ParsedSimpleSearchQuery = {
  result: string | undefined
  warning: string | undefined
}

export const textSearchMinimumLength = 3

// A basic search strategy that searches for the whole text as a single token
const simpleTextSearch = (input: string = '', t?: TFunction): ParsedSimpleSearchQuery => {
  const term = input.length >= textSearchMinimumLength ? input.toLowerCase() : undefined
  const warning =
    !!input && input.length < textSearchMinimumLength
      ? t
        ? t('tableSearch.error.tooShort')
        : 'too short'
      : undefined
  return {
    result: term,
    warning,
  }
}

export type ParsedMultiSearchQuery = {
  result: string[]
  warning: string | undefined
}

const multiTermSearch =
  (textSearchMaximumTokens?: number) =>
  (input: string = '', t?: TFunction): ParsedMultiSearchQuery => {
    const tokens = uniq(
      input
        .split(' ')
        .map(e => e.trim())
        .filter(e => !!e),
    )

    const hasMinimumLength = tokens.some(token => token.length >= textSearchMinimumLength)
    const hasTooManyTokens = textSearchMaximumTokens && tokens.length > textSearchMaximumTokens
    const result = hasMinimumLength
      ? textSearchMaximumTokens
        ? tokens.slice(0, textSearchMaximumTokens)
        : tokens
      : []

    return {
      result,
      warning: hasTooManyTokens
        ? t
          ? t('tableSearch.error.tooMany')
          : 'Too many words'
        : !!tokens.length && !hasMinimumLength
          ? t
            ? t('tableSearch.error.tooShort')
            : 'too short'
          : undefined,
    }
  }

export const textSearch = {
  networkProposalName: multiTermSearch(), // This is client-side, therefore we can accept unlimited tokens
  consensusAccountName: simpleTextSearch,
  runtimeAccountName: simpleTextSearch,
  evmTokenName: simpleTextSearch,
  roflAppName: simpleTextSearch,
  validatorName: multiTermSearch(), // This is client-side, therefore we can accept unlimited tokens
  voterName: multiTermSearch(), // This is client-side, therefore we can accept unlimited tokens
} as const

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
  roflAppId: (searchTerm: string) => {
    if (isValidRoflAppId(searchTerm.replace(/\s/g, '').toLowerCase())) {
      return searchTerm.replace(/\s/g, '').toLowerCase()
    }
  },

  roflAppNameFragment: (searchTerm: string) => textSearch.roflAppName(searchTerm).result,

  evmAccount: (searchTerm: string): string | undefined => {
    if (isValidEthAddress(`0x${searchTerm}`)) {
      return `0x${searchTerm.toLowerCase()}`
    }
    if (isValidEthAddress(searchTerm)) {
      return searchTerm.toLowerCase()
    }
  },

  evmTokenNameFragment: (searchTerm: string) => textSearch.evmTokenName(searchTerm).result,

  networkProposalNameFragment: (searchTerm: string) => textSearch.networkProposalName(searchTerm).result,

  accountNameFragment: (searchTerm: string) => {
    if (searchTerm?.length >= textSearchMinimumLength) {
      return searchTerm.toLowerCase()
    }
  },

  validatorNameFragment: (searchTerm: string) => textSearch.validatorName(searchTerm).result,
} satisfies { [name: string]: (searchTerm: string) => string | string[] | undefined }

export function isSearchValid(searchTerm: string) {
  return Object.values(validateAndNormalize).some(fn => {
    const result = fn(searchTerm)
    return !!result && !(Array.isArray(result) && !result.length)
  })
}

export const getSearchTermFromRequest = (request: Request) =>
  new URL(request.url).searchParams.get('q')?.trim() ?? ''

export const useParamSearch = () => {
  const network = useNetworkParam()

  if (!!network && !RouteUtils.getEnabledNetworks().includes(network)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  const query = useSearchParams()[0].get('q')?.trim() ?? ''
  const normalized = Object.fromEntries(
    Object.entries(validateAndNormalize).map(([key, fn]) => [key, fn(query)]),
  ) as { [Key in keyof typeof validateAndNormalize]: ReturnType<(typeof validateAndNormalize)[Key]> }
  return {
    query,
    ...normalized,
  }
}

export type SearchParams = ReturnType<typeof useParamSearch>

// Provide a list of highlight patterns for a search
export const getHighlightPattern = (
  data: ParsedSimpleSearchQuery | ParsedMultiSearchQuery | undefined,
): HighlightPattern => {
  if (data === undefined) return []
  const { result } = data
  return result === undefined ? [] : Array.isArray(result) ? result : [result]
}
