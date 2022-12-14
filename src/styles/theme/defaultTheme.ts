import { createTheme } from '@mui/material/styles'

declare module '@mui/material/Divider' {
  interface DividerPropsVariantOverrides {
    layout: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    footer: true
  }
}

export const defaultTheme = createTheme({
  palette: {
    background: {
      default: '#3038c3',
    },
    primary: {
      main: '#0092F6',
    },
    secondary: {
      main: '#d9d9d9',
    },
    success: {
      main: '#4cd4a9',
      contrastText: '#fff',
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
      color: '#fff',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '140%',
      color: '#fff',
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '140%',
      color: '#000062',
    },
    h4: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#000062',
      lineHeight: '26px',
    },
    h5: {
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '20px',
      color: '#000062',
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
            backgroundColor: '#c5c7ca',
            color: '#fff',
          },
        },
      },
      variants: [
        {
          props: { color: 'primary' },
          style: () => ({
            '&:hover': {
              backgroundColor: '#3333C4',
            },
            '&:active': {
              backgroundColor: '#000062',
            },
          }),
        },
        {
          props: { color: 'secondary' },
          style: () => ({
            border: '1px solid #000062',
            '&:hover': {
              backgroundColor: '#e2e2e2',
            },
            '&:active': {
              backgroundColor: '#ececec',
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
          color: '#000062',
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
          color: '#000062',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '15px',
          lineHeight: '18px',
          borderRadius: 9,
        },
      },
    },
    MuiDivider: {
      variants: [
        {
          props: { variant: 'layout' },
          style: ({ theme }) => ({
            borderWidth: 1,
            borderColor: '#fff',
            borderStyle: 'dashed',
            marginBottom: theme.spacing(4),
          }),
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#000062',
          textDecorationColor: '#000062',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          padding: theme.spacing(4),
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#f1f4f9',
          color: '#06152b',
          a: {
            fontWeight: 600,
            textDecoration: 'none',
          },
        },
        head: {
          border: 0,
          color: '#3f4284',
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'footer' },
          style: () => ({
            color: '#fff',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '140%',
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
