import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import Fade from '@mui/material/Fade'

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary']
    layout: Palette['primary']
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary']
    layout?: PaletteOptions['primary']
  }

  interface CustomLayoutPalette {
    border?: string
    contrastMain?: string
    darkBorder?: string
    hoverBorder?: string
    lightBorder?: string
    secondary?: string
    primaryBackground?: string
    secondaryBackground?: string
    graphZoomOutText?: string
    helpScreenIconColor?: string
  }

  interface PaletteColor extends CustomLayoutPalette {}
  interface SimplePaletteColorOptions extends CustomLayoutPalette {}
}

declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    select: true
    mono: true
  }
}

declare module '@mui/material/styles' {
  // allow configuration using `createTheme`
  interface TypeBackground {
    empty?: string
  }
}

export const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  palette: {
    background: {
      default: COLORS.white,
    },
    layout: {
      main: COLORS.brandExtraDark,
      border: COLORS.white,
      contrastMain: COLORS.white,
      darkBorder: COLORS.brandExtraDark,
      hoverBorder: COLORS.white,
      lightBorder: COLORS.aqua,
      secondary: COLORS.white,
      primaryBackground: COLORS.brandExtraDark,
      secondaryBackground: COLORS.iconBackground,
      graphZoomOutText: COLORS.white,
      helpScreenIconColor: COLORS.aqua,
    },
    primary: {
      main: COLORS.brandMedium,
    },
    secondary: {
      main: COLORS.lightSilver,
    },
    success: {
      main: COLORS.eucalyptus,
      contrastText: COLORS.white,
    },
    tertiary: {
      main: COLORS.brandLight,
      contrastText: COLORS.white,
    },
  },
  spacing: [0, 2, 4, 8, 16, 32, 64, 128],
  typography: {
    fontFamily: `"Inter Variable", "Helvetica", "Arial", sans-serif`,
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightBold: 700,
    body2: {
      fontSize: '14px',
    },
    h1: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '140%',
      color: COLORS.brandExtraDark,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
      color: COLORS.brandExtraDark,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
      color: COLORS.brandExtraDark,
    },
    h4: {
      fontSize: '18px',
      fontWeight: 700,
      color: COLORS.brandExtraDark,
      lineHeight: '22px',
    },
    h5: {
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '27px',
      color: COLORS.brandExtraDark,
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '18px',
      color: COLORS.brandExtraDark,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontSize: '14px',
          lineHeight: '23px',
          height: '47px',
          borderRadius: 6,
          textTransform: 'capitalize',
          '&:disabled': {
            backgroundColor: COLORS.lavenderGray,
            color: COLORS.white,
          },
        },
        containedPrimary: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLORS.grayMediumLight,
          ':disabled': {
            backgroundColor: COLORS.disabledPrimaryBackground,
            color: COLORS.disabledPrimaryText,
            borderColor: COLORS.grayMediumLight,
          },
          '&:hover, &:focus-visible': {
            backgroundColor: COLORS.brandLight,
            borderColor: COLORS.brandLight,
          },
          '&:active': {
            backgroundColor: COLORS.brandExtraDark,
            borderColor: COLORS.brandExtraDark,
          },
        },
        outlinedSecondary: {
          borderColor: COLORS.brandExtraDark,
          color: COLORS.brandExtraDark,
          backgroundColor: COLORS.white,
          ':disabled': {
            backgroundColor: COLORS.disabledPrimaryBackground,
            color: COLORS.disabledPrimaryText,
            borderColor: COLORS.grayMediumLight,
          },
          '&:hover, &:focus-visible': {
            backgroundColor: COLORS.grayMediumLight,
            borderColor: COLORS.brandExtraDark,
          },
          '&:active': {
            backgroundColor: COLORS.grayMedium,
            borderColor: COLORS.brandExtraDark,
          },
        },
        textPrimary: {
          color: COLORS.brandDark,
          '&&:hover, &&:focus-visible, &&:active': {
            color: COLORS.brandExtraDark,
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
        },
        textSizeMedium: {
          fontSize: '14px',
        },
        textSizeSmall: {
          fontSize: '14px',
        },
      },
      variants: [
        {
          props: { color: 'primary' },
          style: () => ({
            '&:hover, &:focus-visible': {
              backgroundColor: COLORS.brandDark,
            },
            '&:active': {
              backgroundColor: COLORS.brandExtraDark,
            },
          }),
        },
        {
          props: { color: 'secondary' },
          style: () => ({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.brandExtraDark,
            '&:hover, &:focus-visible': {
              backgroundColor: COLORS.platinum,
            },
            '&:active': {
              backgroundColor: COLORS.brightGray2,
            },
            '&:disabled': {
              border: 'none',
            },
          }),
        },
        {
          props: { color: 'secondary', variant: 'contained' },
          style: () => ({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.grayLight,
            backgroundColor: COLORS.brandExtraDark,
            color: COLORS.white,
            '&:hover, &:focus-visible': {
              borderColor: COLORS.brandExtraDark,
              backgroundColor: COLORS.white,
              color: COLORS.brandExtraDark,
            },
          }),
        },
        {
          props: { color: 'secondary', variant: 'text' },
          style: () => ({
            color: COLORS.white,
            borderWidth: '0',
            backgroundColor: 'transparent',
            '&:hover, &:focus-visible': {
              backgroundColor: 'transparent',
            },
            '&:disabled': {
              backgroundColor: 'transparent',
            },
          }),
        },
        {
          props: { color: 'tertiary' },
          style: () => ({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.brandLight,
            backgroundColor: COLORS.brandLight,
            '&:hover, &:focus-visible': {
              backgroundColor: COLORS.brandExtraDark,
              borderColor: COLORS.brandExtraDark,
            },
            '&:active': {
              backgroundColor: COLORS.brandExtraDark,
              borderColor: COLORS.brandExtraDark,
            },
            '&:disabled': {
              border: 'none',
            },
          }),
        },
      ],
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          // Fixes accessibility: MUI relied on ripples to show focus.
          '&:focus-visible': {
            outline: 'revert',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: COLORS.brandDark,
          fontWeight: 700,
          textDecoration: 'none',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        TransitionComponent: Fade,
        TransitionProps: { timeout: 600 },
      },
      styleOverrides: {
        arrow: {
          color: COLORS.brandExtraDark,
        },
        tooltip: ({ theme }) => ({
          backgroundColor: COLORS.brandExtraDark,
          borderRadius: theme.spacing(3),
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          fontSize: '13px',
          fontWeight: 700,
          maxWidth: '400px',
          padding: theme.spacing(3, 4),
        }),
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'mono' },
          style: () => ({
            fontFamily: 'Roboto Mono Variable, monospace',
            fontWeight: 700,
          }),
        },
        {
          props: { variant: 'select' },
          style: () => ({
            color: COLORS.white,
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
          }),
        },
      ],
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiMobileStepper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
        dot: ({ theme }) => ({
          width: '30px',
          height: '4px',
          background: 'transparent',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.palette.layout.main,
          borderRadius: theme.spacing(2),
        }),
        dotActive: ({ theme }) => ({
          background: theme.palette.layout.main,
        }),
      },
    },
  },
})
