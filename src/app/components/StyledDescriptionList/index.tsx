import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { backgroundColorAnimation } from '../../../styles/theme/animations'

interface Props {
  /**
   * Width of `<dt>` (first column)
   *
   * **Syntax**: `100px | 10% | 10ch | max-content | auto | minmax(min, max)`
   */
  titleWidth?: string

  /**
   * Width of `<dd>` (second column)
   *
   * **Syntax**: `100px | 10% | 10ch | max-content | auto | minmax(min, max)`
   */
  descriptionWidth?: string
}

const InlineDescriptionList = styled('dl', {
  shouldForwardProp: prop => prop !== 'titleWidth' && prop !== 'descriptionWidth',
})<Props>`
  display: grid;
  grid-template-columns:
    ${props => props.titleWidth ?? 'max-content'}
    ${props => props.descriptionWidth ?? 'auto'};
  margin: 0;
  dd {
    margin: 0;
    padding-left: ${({ theme }) => theme.spacing(4)};
  }
`

interface StyledDescriptionListProps {
  standalone?: boolean
  highlight?: boolean
}

export const StyledDescriptionList = styled(InlineDescriptionList, {
  shouldForwardProp: prop => prop !== 'standalone' && prop !== 'highlight',
})<StyledDescriptionListProps>(({ theme, standalone, highlight }) => ({
  'dt, dd': {
    display: 'flex',
    alignItems: 'center',
    boxShadow: `0px 1px 0px ${COLORS.grayLight}`,
    ':last-of-type': {
      boxShadow: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(3)} 0`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(4)} 0`,
    },
  },
  dt: {
    color: COLORS.grayDark,
  },
  dd: {
    color: COLORS.brandExtraDark,
  },
  ...(standalone && {
    '&&': {
      padding: theme.spacing(2),
      backgroundColor: COLORS.white,
      marginBottom: theme.spacing(4),
      borderRadius: '12px',
    },
  }),
  ...(highlight && backgroundColorAnimation),
}))
