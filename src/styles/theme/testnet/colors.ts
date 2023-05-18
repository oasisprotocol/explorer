import { COLORS as DEFAULT_COLORS } from '../colors'

export const COLORS = {
  ...DEFAULT_COLORS,
  testnet: '#ffa800',
  testnetLight: '#fff0e4',
} satisfies { [colorName: string]: string }
