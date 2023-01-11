import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

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

export const StyledDescriptionList = styled(InlineDescriptionList)(({ theme }) => ({
  'dt, dd': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
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
}))
