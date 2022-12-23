import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles/createPalette' {
  export interface PaletteOptions {
    tertiary: PaletteColorOptions
  }
}

declare module '@mui/material/Button' {
  export interface ButtonPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/Divider' {
  interface DividerPropsVariantOverrides {
    layout: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    footer: true
    select: true
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    content: true
  }
}

export const defaultTheme = createTheme({
  palette: {
    background: {
      default: COLORS.persianBlue,
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
    fontFamily: `"Euclid Circular B Medium", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightBold: 500,
    body2: {
      fontSize: '16px',
    },
    h1: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '140%',
      color: COLORS.white,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '140%',
      color: COLORS.white,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '140%',
      color: COLORS.brandExtraDark,
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
      color: COLORS.brandExtraDark,
      lineHeight: '26px',
    },
    h5: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '20px',
      color: COLORS.brandExtraDark,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          fontSize: '18px',
          lineHeight: '23px',
          height: '47px',
          borderRadius: 47,
          '&:disabled': {
            backgroundColor: COLORS.lavenderGray,
            color: COLORS.white,
          },
        },
      },
      variants: [
        {
          props: { color: 'primary' },
          style: () => ({
            '&:hover': {
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
            '&:hover': {
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
          props: { color: 'tertiary' },
          style: () => ({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.brandLight,
            backgroundColor: COLORS.brandLight,
            '&:hover': {
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
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: `${theme.spacing(4)} ${theme.spacing(5)} 0`,
          marginBottom: theme.spacing(4),
          boxShadow: 'none',
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
          fontWeight: 600,
          fontSize: '24px',
          margin: 0,
          padding: `0 0 ${theme.spacing(4)} 0`,
        }),
        action: {
          alignSelf: 'center',
          margin: 0,
          fontWeight: 400,
          fontSize: '16px',
          color: COLORS.brandExtraDark,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          lineHeight: '18px',
          borderRadius: 9,
          gap: 2,
        },
        label: {
          padding: 0,
        },
      },
    },
    MuiDivider: {
      variants: [
        {
          props: { variant: 'layout' },
          style: ({ theme }) => ({
            borderWidth: 1,
            borderColor: COLORS.white,
            borderStyle: 'dashed',
            marginBottom: theme.spacing(5),
          }),
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: COLORS.brandExtraDark,
          textDecorationColor: COLORS.brandExtraDark,
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: 'content' },
          style: () => ({
            backgroundColor: COLORS.brightGray,
            boxShadow: 'none',
            color: COLORS.darkBlueGray,
          }),
        },
      ],
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: theme.spacing(4),
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.grayLight,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLORS.vistaBlue,
          borderRadius: 5,
        },
        bar: {
          backgroundColor: COLORS.brandDark,
          borderRadius: 5,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: COLORS.antiFlashWhite2,
          color: COLORS.grayExtraDark,
          whiteSpace: 'nowrap',
          a: {
            color: COLORS.brandDark,
            fontWeight: 600,
            textDecoration: 'none',
          },
        },
        head: {
          border: 0,
          color: COLORS.darkSlateBlue,
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'footer' },
          style: () => ({
            color: COLORS.white,
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '140%',
          }),
        },
        {
          props: { variant: 'select' },
          style: () => ({
            color: COLORS.white,
            fontWeight: 400,
            fontSize: '16px',
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
  },
})
