import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import { defaultTheme } from '../defaultTheme'

export const pontusXDevnetTheme = createTheme(
  deepmerge(defaultTheme, {
    palette: {
      background: {
        default: COLORS.devnetLightBgColor,
      },
      layout: {
        main: COLORS.devnetBgColor,
        border: COLORS.devnetBgColor,
        hoverBorder: COLORS.devnetBgColor,
        contrastSecondary: COLORS.devnetBgColor,
        secondary: COLORS.devnetBgColor,
      },
    },
  }),
)
