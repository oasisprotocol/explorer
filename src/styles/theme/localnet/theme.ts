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
        contrastSecondary: COLORS.localnet,
        darkBorder: COLORS.localnet,
        hoverBorder: COLORS.localnet,
        lightBorder: COLORS.localnet,
        secondary: COLORS.localnet,
        primaryBackground: COLORS.localnetLight,
        secondaryBackground: COLORS.white,
        networkBubbleBorder: COLORS.localnet,
        titleOnBackground: COLORS.grayExtraDark,
        graphZoomOutText: COLORS.brandDark,
        helpScreenIconColor: COLORS.brandExtraDark,
      },
    },
  }),
)
