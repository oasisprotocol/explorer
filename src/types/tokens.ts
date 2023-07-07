import { EvmTokenType } from '../oasis-nexus/api'
import { TFunction } from 'i18next'
import { exhaustedTypeWarning } from './errors'

const getTokenTypeDescription = (t: TFunction, tokenType: EvmTokenType): string => {
  switch (tokenType) {
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

export const getTokenTypeStrictName = (t: TFunction, tokenType: EvmTokenType): string => {
  switch (tokenType) {
    case 'ERC20':
      return t('account.ERC20')
    case 'ERC721':
      return t('account.ERC721')
    default:
      exhaustedTypeWarning('Unknown token type', tokenType)
      return tokenType
  }
}

export const getTokenTypeName = (t: TFunction, tokenType: EvmTokenType): string =>
  t('tokens.typeDescription', {
    spec: getTokenTypeStrictName(t, tokenType),
    description: getTokenTypeDescription(t, tokenType),
  })

export const getTokenTypePluralName = (t: TFunction, tokenType: EvmTokenType): string =>
  t('tokens.typeDescription', {
    spec: getTokenTypeStrictName(t, tokenType),
    description: getTokenTypePluralDescription(t, tokenType),
  })
