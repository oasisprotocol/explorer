import { COLORS as DEFAULT_COLORS } from '../colors'

export const COLORS = {
  ...DEFAULT_COLORS,
  localnet: '#cecece',
  localnetLight: '#ebebeb',
} satisfies { [colorName: string]: string }
