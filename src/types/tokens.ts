import { EvmTokenType } from '../oasis-nexus/api'
import { COLORS } from '../styles/theme/colors'

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
