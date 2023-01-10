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

export const StyledDescriptionList = styled(InlineDescriptionList)`
  && dt,
  && dd {
    padding-top: ${({ theme }) => theme.spacing(4)};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    font-size: 14px;

    box-shadow: 0px 1px 0px ${COLORS.grayLight};
    :last-of-type {
      box-shadow: none;
    }
  }

  dt {
    color: ${COLORS.grayDark};
  }

  dd {
    color: ${COLORS.brandExtraDark};
  }
`
