import Typography from '@mui/material/Typography'
import { TypographyTypeMap } from '@mui/material/Typography/Typography'
import { ReactElement } from 'react'

export const AppTypography = <P extends {}, D extends React.ElementType = 'span'>(props: TypographyTypeMap<P, D>['props']): ReactElement => {
  return (
    <Typography {...props} />
  )
}
