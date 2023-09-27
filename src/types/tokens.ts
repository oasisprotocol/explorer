import { EvmNft, EvmTokenType } from '../oasis-nexus/api'
import { TFunction } from 'i18next'
import { exhaustedTypeWarning } from './errors'
import { COLORS } from '../styles/theme/colors'

const nftTokenTypes: EvmTokenType[] = [EvmTokenType.ERC721]

export const isTokenTypeNFT = (tokenType: EvmTokenType): boolean => nftTokenTypes.includes(tokenType)

export const getTokenTypeDescription = (t: TFunction, tokenType: EvmTokenType | undefined): string => {
  switch (tokenType ?? 'missing') {
    case 'missing':
      return t('common.missing')
    case 'ERC20':
      return t('common.token')
    case 'ERC721':
      return t('common.nft')
    default:
      exhaustedTypeWarning('Unknown token type', tokenType as any)
      return '???'
  }
}

export const tokenBackgroundColor: Record<EvmTokenType | 'missing', string> = {
  missing: COLORS.errorIndicatorBackground,
  ERC20: COLORS.brandMedium15,
  ERC721: COLORS.pink15,
}

export const tokenBorderColor: Record<EvmTokenType | 'missing', string> = {
  missing: COLORS.pink,
  ERC20: COLORS.brandMedium,
  ERC721: COLORS.pink,
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

export const getNFTInstanceLabel = (instance: EvmNft) =>
  instance.name ? `"${instance.name}" (#${instance.id})` : `ID: #${instance.id}`

export const getTokenTypeCollectionTitle = (t: TFunction, tokenType: EvmTokenType): string =>
  t('tokens.collectionTitle', {
    spec: getTokenTypeStrictName(t, tokenType),
    description: t('common.tokens'),
  })
