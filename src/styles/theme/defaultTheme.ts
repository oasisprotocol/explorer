import { createTheme } from '@mui/material/styles'
import { COLORS } from './colors'
import Fade from '@mui/material/Fade'

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary']
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary']
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
    card: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    footer: true
    select: true
    mono: true
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    content: true
  }
}

declare module '@mui/material/Chip' {
  export interface ChipPropsColorOverrides {
    tertiary: true
  }
  export interface ChipPropsVariantOverrides {
    ['outlined-selected']: true
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
    fontFamily: `"FigtreeVariable", "Helvetica", "Arial", sans-serif`,
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
      color: COLORS.brandExtraDark,
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: '140%',
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
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: '24px',
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
    MuiAlert: {
      variants: [
        {
          props: { severity: 'error' },
          style: () => ({
            color: COLORS.errorIndicatorBackground,
          }),
        },
        {
          props: { severity: 'warning' },
          style: () => ({
            color: COLORS.warningColor,
            backgroundColor: COLORS.warningBackground,
          }),
        },
      ],
      styleOverrides: {
        root: ({ theme }) => ({
          alignItems: 'center',
          padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
          borderRadius: 10,
        }),
        icon: {
          padding: 0,
        },
        message: {
          padding: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
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
        containedPrimary: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLORS.grayMediumLight,
          textTransform: 'capitalize',
          ':disabled': {
            backgroundColor: COLORS.disabledPrimaryButton,
          },
        },
        containedSecondary: {
          textTransform: 'capitalize',
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
          props: { color: 'secondary', variant: 'contained' },
          style: () => ({
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.grayLight,
            backgroundColor: COLORS.brandExtraDark,
            color: COLORS.white,
            '&:hover': {
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
            '&:hover': {
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
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          boxShadow: 'none',
          [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(4),
            padding: `${theme.spacing(4)} ${theme.spacing(4)} 0`,
            ':has(table)': {
              paddingRight: 0,
            },
          },
          [theme.breakpoints.up('sm')]: {
            marginBottom: theme.spacing(5),
            padding: `${theme.spacing(5)} ${theme.spacing(5)} 0`,
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
          fontSize: '24px',
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
          fontSize: '16px',
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
    MuiChip: {
      variants: [
        {
          props: { color: 'tertiary' },
          style: () => ({
            color: COLORS.brandExtraDark,
            backgroundColor: COLORS.purpleBackground,
            borderColor: COLORS.brandDark,
          }),
        },
        {
          props: { color: 'primary' },
          style: ({ theme }) => ({
            color: COLORS.grayMedium,
            backgroundColor: COLORS.grayMediumLight,
            borderColor: COLORS.grayMedium,
            borderWidth: theme.spacing(1),
          }),
        },
        {
          props: { variant: 'outlined-selected', color: 'secondary' },
          style: () => ({
            border: `solid 1px ${COLORS.grayMediumLight}`,
            backgroundColor: COLORS.grayMediumLight,
            ':hover': {
              backgroundColor: COLORS.grayMediumLight,
            },
          }),
        },
      ],
      styleOverrides: {
        colorSecondary: {
          color: COLORS.brandExtraDark,
        },

        root: ({ theme }) => ({
          fontSize: '15px',
          lineHeight: '18px',
          fontWeight: 400,
          borderRadius: 9,
          gap: 2,
          padding: theme.spacing(3),
        }),
        label: {
          padding: 0,
        },
        icon: {
          marginLeft: 0,
          marginRight: 2,
        },
      },
    },
    MuiDivider: {
      variants: [
        {
          props: { variant: 'layout' },
          style: ({ theme }) => ({
            // More customizable than borderStyle: 'dashed',
            borderImage: `repeating-linear-gradient(90deg, ${COLORS.white}, ${COLORS.white} 5px, transparent 5px, transparent 12px) 1`,
            marginBottom: theme.spacing(5),
          }),
        },
        {
          props: { variant: 'card' },
          style: ({ theme }) => ({
            // More customizable than borderStyle: 'dashed',
            borderImage: `repeating-linear-gradient(90deg, ${COLORS.brandDark}, ${COLORS.brandDark} 5px, transparent 5px, transparent 12px) 1`,
            margin: '40px -12px',
            [theme.breakpoints.down('sm')]: {
              margin: '20px -12px',
            },
          }),
        },
      ],
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
    MuiPaper: {
      variants: [
        {
          props: { variant: 'content' },
          style: ({ theme }) => ({
            backgroundColor: COLORS.brightGray,
            boxShadow: 'none',
            color: COLORS.darkBlueGray,
            padding: theme.spacing(4),
          }),
        },
      ],
      styleOverrides: {
        root: () => ({
          borderRadius: 12,
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
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            paddingRight: theme.spacing(4),
            marginLeft: `-${theme.spacing(4)}`,
          },
        }),
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
            fontWeight: 700,
            textDecoration: 'none',
          },
        },
        head: {
          border: 0,
          color: COLORS.grayDark,
          fontWeight: 400,
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
            fontFamily: 'Roboto MonoVariable, monospace',
            fontWeight: 700,
          }),
        },
        {
          props: { variant: 'footer' },
          style: () => ({
            color: COLORS.white,
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '18px',
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
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '3px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '24px',
          backgroundColor: COLORS.grayMediumLight,
          '.MuiInputBase-root': {
            borderRadius: '24px',
            backgroundColor: COLORS.white,

            // Prevent first child's edges overflowing due to border-radius
            '&.MuiInputBase-adornedStart .MuiInputAdornment-positionStart': {
              marginLeft: theme.spacing(4),
            },
            '&:not(.MuiInputBase-adornedStart) .MuiInputBase-input': {
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
    MuiPagination: {
      variants: [
        {
          props: { showFirstButton: true, showLastButton: true },
          style: {
            // Swap First and Previous page buttons
            'li:nth-of-type(2)': {
              order: -1,
            },
            // Swap Last and Next page buttons
            'li:nth-last-of-type(2)': {
              order: 1,
            },
          },
        },
      ],
    },
    MuiPaginationItem: {
      variants: [
        {
          props: { selected: false },
          style: {
            color: COLORS.brandExtraDark,
          },
        },
        {
          props: { selected: true },
          style: {
            backgroundColor: 'unset !important',
            color: COLORS.disabledPagination,
          },
        },
        {
          props: { type: 'page' },
          style: {
            minWidth: 0,
          },
        },
      ],
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          // neglect the default border radius of sibling element (Card component in most cases)
          '&& + *': {
            borderTopLeftRadius: 0,
          },
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-selected': {
            color: COLORS.brandExtraDark,
            backgroundColor: COLORS.white,
          },
          fontSize: '16px',
          fontWeight: 700,
          color: COLORS.brandDark,
          backgroundColor: COLORS.inactiveTab,
          marginRight: theme.spacing(2),
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          textTransform: 'capitalize',
          [theme.breakpoints.down('sm')]: {
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
          },
          [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing(4)} ${theme.spacing(5)}`,
          },
        }),
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
          background: COLORS.white025A,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLORS.grayMedium,
          borderRadius: theme.spacing(2),
          boxShadow: '0 4px 50px 15px rgba(0, 0, 98, 0.54)',
        }),
        dotActive: {
          background: COLORS.white,
        },
      },
    },
    MuiIconButton: {
      variants: [
        {
          props: { color: 'primary' },
          style: () => ({
            background: COLORS.white,
            svg: {
              color: COLORS.brandExtraDark,
            },
            '&:hover': {
              background: COLORS.white,
            },
          }),
        },
      ],
    },
  },
})
