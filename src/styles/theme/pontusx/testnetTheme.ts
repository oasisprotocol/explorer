import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import { defaultTheme } from '../defaultTheme'

export const pontusXTestnetTheme = createTheme(
  deepmerge(defaultTheme, {
    palette: {
      background: {
        default: COLORS.testnetLightBgColor,
      },
      layout: {
        main: COLORS.testnetBgColor,
        border: COLORS.testnetBgColor,
        hoverBorder: COLORS.testnetBgColor,
        contrastSecondary: COLORS.testnetBgColor,
        secondary: COLORS.testnetBgColor,
      },
    },
  }),
)
