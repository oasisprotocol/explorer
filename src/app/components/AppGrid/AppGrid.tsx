import Grid from '@mui/material/Grid'
import { GridTypeMap } from '@mui/material/Grid/Grid'
import { ReactElement } from 'react'

export const AppGrid = <P extends {}, D extends React.ElementType = 'div'>(props: GridTypeMap<P, D>['props']): ReactElement => {
  return (
    <Grid {...props} />
  )
}
