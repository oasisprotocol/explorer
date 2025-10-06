import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import Fade from '@mui/material/Fade'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import { inputBaseClasses } from '@mui/material/InputBase'
import { inputAdornmentClasses } from '@mui/material/InputAdornment'

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
    contrastSecondary?: string
    darkBorder?: string
    hoverBorder?: string
    lightBorder?: string
    secondary?: string
    primaryBackground?: string
    secondaryBackground?: string
    networkBubbleBorder?: string
    titleOnBackground?: string
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
      contrastSecondary: COLORS.white,
      darkBorder: COLORS.brandExtraDark,
      hoverBorder: COLORS.white,
      lightBorder: COLORS.aqua,
      secondary: COLORS.white,
      primaryBackground: COLORS.brandExtraDark,
      secondaryBackground: COLORS.iconBackground,
      networkBubbleBorder: COLORS.white,
      titleOnBackground: COLORS.brandExtraDark,
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
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 6,
          border: `1px solid ${COLORS.grayLight}`,
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          fontSize: '14px',
          [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(4),
            padding: theme.spacing(4),
            ':has(table)': {
              paddingRight: 0,
            },
          },
          [theme.breakpoints.up('sm')]: {
            marginBottom: '24px',
            padding: theme.spacing('24px'),
          },
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: COLORS.brandExtraDark,
          margin: 0,
          paddingBottom: theme.spacing(4),
          paddingLeft: 0,
          paddingTop: 0,
          paddingRight: 0,
          [theme.breakpoints.down('sm')]: {
            paddingRight: theme.spacing(4),
          },
        }),
        action: {
          margin: 0,
          fontWeight: 400,
          fontSize: '14px',
          color: COLORS.brandExtraDark,
        },
        title: {
          fontWeight: 700,
        },
        subheader: {
          fontStyle: 'italic',
          color: COLORS.grayMedium,
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
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            paddingRight: theme.spacing(4),
            // force scrollbar to cover the whole table horizontally
            marginLeft: `-${theme.spacing(4)}`,
            width: `calc(100% + ${theme.spacing(4)})`,
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: COLORS.antiFlashWhite2,
          color: COLORS.grayExtraDark,
          whiteSpace: 'nowrap',
          padding: theme.spacing(4, 3),
          // Low specificity
          ':is(a)': {
            color: COLORS.brandDark,
            fontWeight: 700,
            textDecoration: 'none',
          },
        }),
        head: {
          color: COLORS.grayDark,
          fontWeight: 500,
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
    MuiInputBase: {
      styleOverrides: {
        root: {
          padding: 0,
        },
        input: {
          backgroundColor: COLORS.white,
          color: COLORS.grayDark,
          '&::placeholder': {
            color: COLORS.grayDark,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: 0,
          [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
            borderWidth: '3px',
          },
        },
        notchedOutline: {
          borderColor: 'transparent',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '6px',
          backgroundColor: COLORS.grayMediumLight,
          [`.${inputBaseClasses.root}`]: {
            borderRadius: '6px',
            backgroundColor: COLORS.white,

            // Prevent first child's edges overflowing due to border-radius
            [`&.${inputBaseClasses.adornedStart} .${inputAdornmentClasses.positionStart}`]: {
              marginLeft: theme.spacing(4),
            },
            [`&:not(.${inputBaseClasses.adornedStart}) .${inputBaseClasses.input}`]: {
              marginLeft: theme.spacing(4),
            },
          },
          ':focus-within': {
            boxShadow: '0px 4px 50px 15px rgba(0, 0, 98, 0.54)',
          },
          transition: 'box-shadow 250ms ease-in-out',
        }),
      },
    },
    MuiInputAdornment: {
      variants: [
        {
          props: { position: 'end' },
          style: {
            height: '100%',
            maxHeight: '100%',
          },
        },
      ],
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
