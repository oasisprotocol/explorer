import { TFunction } from 'i18next'
import { exhaustedTypeWarning } from '../../types/errors'
import { EvmTokenType } from 'oasis-nexus/api'

export const getTokenMarketCap = (
  relativeTotalValue: number | undefined,
  rosePriceInUsd: number | undefined,
) => {
  if (typeof relativeTotalValue !== 'number' || !rosePriceInUsd) {
    return undefined
  }
  // Convert atto wROSE
  const totalValueInWRose = relativeTotalValue / Math.pow(10, 18)
  const totalValueInUsd = totalValueInWRose * rosePriceInUsd
  return totalValueInUsd
}

export const getTokenTypeDescription = (t: TFunction, tokenType: EvmTokenType | undefined): string => {
  switch (tokenType) {
    case undefined:
      return t('common.missing')
    case 'ERC20':
      return t('common.token')
    case 'ERC721':
      return t('common.nft')
    default:
      exhaustedTypeWarning('Unknown token type', tokenType)
      return '???'
  }
}

export const getTokenTypePluralDescription = (t: TFunction, tokenType: EvmTokenType): string => {
  switch (tokenType) {
    case 'ERC20':
      return t('common.tokens')
    case 'ERC721':
      return t('common.nfts')
    default:
      exhaustedTypeWarning('Unknown token type', tokenType)
      return '???'
  }
}

export const getTokenTypeStrictName = (t: TFunction, tokenType: EvmTokenType | 'missing'): string => {
  switch (tokenType) {
    case 'missing':
      return t('common.missing')
    case 'ERC20':
      return t('account.ERC20')
    case 'ERC721':
      return t('account.ERC721')
    default:
      exhaustedTypeWarning('Unknown token type', tokenType)
      return tokenType
  }
}

export const getTokenTypePluralName = (t: TFunction, tokenType: EvmTokenType): string =>
  t('tokens.typeDescription', {
    spec: getTokenTypeStrictName(t, tokenType),
    description: getTokenTypePluralDescription(t, tokenType),
  })
