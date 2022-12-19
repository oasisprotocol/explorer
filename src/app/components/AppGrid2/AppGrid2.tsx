import { ReactElement } from 'react'
import { Unstable_Grid2 } from '@mui/material'
import { Grid2TypeMap } from '@mui/material/Unstable_Grid2/Grid2Props'

export const AppGrid2 = <P extends {}, D extends React.ElementType = 'div'>(props: Grid2TypeMap<P, D>['props']): ReactElement => {
  return (
    <Unstable_Grid2 {...props} />
  )
}
