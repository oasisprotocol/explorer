import { ReactElement } from 'react'
import Divider from '@mui/material/Divider'
import { DividerTypeMap } from '@mui/material/Divider/Divider'

export const AppDivider = <P extends {}, D extends React.ElementType = 'hr'>(props: DividerTypeMap<P, D>['props']): ReactElement => {
  return (
    <Divider {...props} />
  )
}
