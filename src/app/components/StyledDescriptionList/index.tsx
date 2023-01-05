import { styled } from '@mui/material/styles'

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
  dt {
    ${({ theme }) => theme.typography.body1}
    color: #31435a;

    padding-top: ${({ theme }) => theme.spacing(4)};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    box-shadow: 0px 1px 0px #f4f5f7;
    :last-of-type {
      box-shadow: none;
    }
  }

  dd {
    ${({ theme }) => theme.typography.body1}
    color: #000062;

    padding-top: ${({ theme }) => theme.spacing(4)};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    box-shadow: 0px 1px 0px #f4f5f7;
    :last-of-type {
      box-shadow: none;
    }
  }
`
