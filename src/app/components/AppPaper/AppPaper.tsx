import { ReactElement } from 'react'
import Paper from '@mui/material/Paper'
import { PaperTypeMap } from '@mui/material/Paper/Paper'

export const AppPaper = <P extends {}, D extends React.ElementType = 'div'>(props: PaperTypeMap<P, D>['props']): ReactElement => {
  return (
    <Paper {...props} />
  )
}
