import { COLORS as DEFAULT_COLORS } from '../colors'

export const COLORS = {
  ...DEFAULT_COLORS,
  testnetBgColor: '#2A5575',
  testnetLightBgColor: '#E4E9ED',
  devnetBgColor: `#152B3B`,
  devnetLightBgColor: `#8A959D`,
} satisfies { [colorName: string]: string }
