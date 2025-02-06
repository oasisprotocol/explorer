import { createTheme, css } from '@mui/material/styles'
import { COLORS } from './colors'
import Fade from '@mui/material/Fade'
import { outlinedInputClasses } from '@mui/material/OutlinedInput'
import { inputBaseClasses } from '@mui/material/InputBase'
import { inputAdornmentClasses } from '@mui/material/InputAdornment'
import { tabClasses } from '@mui/material/Tab'
import { menuItemClasses } from '@mui/material/MenuItem'
import { switchClasses } from '@mui/material/Switch'
import { buttonBaseClasses } from '@mui/material/ButtonBase'

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

declare module '@mui/material/styles' {
  // allow configuration using `createTheme`
  interface TypeBackground {
    empty?: string
  }
}

export const defaultTheme = createTheme({
  breakpoints: {
    values: {
      ...createTheme().breakpoints.values,
      lg: 1024,
    },
  },
  palette: {
    background: {
      default: COLORS.brandDark,
      empty: COLORS.brandExtraDark,
    },
    layout: {
      main: COLORS.white,
      border: COLORS.brandDark,
      contrastMain: COLORS.brandExtraDark,
      contrastSecondary: COLORS.white,
      darkBorder: COLORS.brandExtraDark,
      hoverBorder: COLORS.white,
      lightBorder: COLORS.aqua,
      secondary: COLORS.brandDark,
      primaryBackground: COLORS.brandExtraDark,
      secondaryBackground: COLORS.iconBackground,
      networkBubbleBorder: COLORS.white,
      titleOnBackground: COLORS.white,
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
    fontFamily: `"Figtree Variable", "Helvetica", "Arial", sans-serif`,
    fontWeightLight: 200,
    fontWeightRegular: 400,
    fontWeightBold: 700,
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
          padding: theme.spacing(2, 3),
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
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
          fontSize: '16px',
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
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          // Fixes accessibility: MUI relied on ripples to show focus.
          // https://css-tricks.com/copy-the-browsers-native-focus-styles/
          [`&.${buttonBaseClasses.focusVisible} .${switchClasses.thumb}`]: css`
            outline: 5px auto Highlight;
            outline: 5px auto -webkit-focus-ring-color;
          `,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(4),
            padding: theme.spacing(4, 4, 0),
            ':has(table)': {
              paddingRight: 0,
            },
          },
          [theme.breakpoints.up('sm')]: {
            marginBottom: theme.spacing(5),
            padding: theme.spacing(5, 5, 0),
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
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          fontSize: '18px',
        },
        separator: {
          color: COLORS.brandDark,
          fontSize: '18px',
          paddingRight: 3,
          paddingLeft: 3,
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
            ':hover, :focus-visible': {
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
            borderImage: `repeating-linear-gradient(90deg, ${theme.palette.layout.main}, ${theme.palette.layout.main} 5px, transparent 5px, transparent 12px) 1`,
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
    MuiDrawer: {
      styleOverrides: {
        paperAnchorTop: ({ theme }) => ({
          borderRadius: '0 0 12px 12px',
          padding: theme.spacing(4, '5%'),
        }),
        paper: ({ theme }) => ({
          [theme.breakpoints.down('md')]: {
            height: '100vh',
          },
        }),
      },
    },
    MuiImageList: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up('sm')]: {
            // default gridTemplateColumns is set by cols prop default number via inline styles
            // and cannot be overridden without !important statement
            gridTemplateColumns: `repeat(auto-fill, minmax(210px, auto))!important`,
          },
        }),
      },
    },
    MuiImageListItem: {
      styleOverrides: {
        root: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: COLORS.brandExtraDark,
          borderRadius: 8,
          overflow: 'hidden',
          transition: 'border-color, box-shadow 250ms ease-in-out',
          '&:hover, &:focus-visible': {
            boxShadow: '0px 8px 8px 0px rgba(0, 0, 0, 0.15)',
            borderColor: COLORS.brandDark,
          },
        },
      },
    },
    MuiImageListItemBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
        }),
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
          borderRadius: 5,
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
          a: {
            color: COLORS.brandDark,
            fontWeight: 700,
            textDecoration: 'none',
          },
        }),
        head: {
          border: 0,
          color: COLORS.grayDark,
          fontWeight: 700,
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
          props: { variant: 'footer' },
          style: ({ theme }) => ({
            color: theme.palette.layout.main,
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
          borderRadius: '24px',
          backgroundColor: COLORS.grayMediumLight,
          [`.${inputBaseClasses.root}`]: {
            borderRadius: '24px',
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
        root: ({ theme }) => ({
          // neglect the default border radius of sibling element (Card component in most cases)
          '&& + *': {
            borderTopLeftRadius: 0,
            [theme.breakpoints.down('sm')]: {
              borderTopRightRadius: 0,
            },
          },
        }),
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover, &:focus-visible': {
            color: COLORS.brandExtraDark,
            backgroundColor: COLORS.grayLight,
          },
          [`&.${tabClasses.selected}`]: {
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
            padding: theme.spacing(3, 4),
          },
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4, 5),
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
    MuiIconButton: {
      variants: [
        {
          props: { color: 'primary' },
          style: () => ({
            background: COLORS.white,
            svg: {
              color: COLORS.brandExtraDark,
            },
            '&:hover, &:focus-visible': {
              background: COLORS.white,
            },
          }),
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: COLORS.grayExtraDark,
          [`&.${menuItemClasses.selected}`]: {
            color: COLORS.brandDark,
            backgroundColor: COLORS.grayLight,
            '&:hover': {
              color: COLORS.brandDark,
              backgroundColor: COLORS.grayMediumLight,
            },
          },
          [`&.${menuItemClasses.disabled}`]: {
            color: COLORS.grayMedium,
            opacity: 1,
          },
          '&:hover': {
            color: COLORS.grayExtraDark,
            backgroundColor: COLORS.grayMediumLight,
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          paddingTop: 0,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
})
