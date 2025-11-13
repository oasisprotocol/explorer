import { deepmerge } from '@mui/utils'
import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import { defaultTheme } from '../defaultTheme'

export const localnetTheme = createTheme(
  deepmerge(defaultTheme, {
    palette: {
      background: {
        default: COLORS.localnetLight,
        empty: COLORS.white,
      },
      layout: {
        main: COLORS.brandExtraDark,
        border: COLORS.localnet,
        contrastMain: COLORS.brandExtraDark,
        darkBorder: COLORS.localnet,
        hoverBorder: COLORS.localnet,
        lightBorder: COLORS.localnet,
        secondary: COLORS.localnet,
        primaryBackground: COLORS.localnetLight,
        secondaryBackground: COLORS.white,
        graphZoomOutText: COLORS.brandDark,
        helpScreenIconColor: COLORS.brandExtraDark,
      },
    },
  }),
)
