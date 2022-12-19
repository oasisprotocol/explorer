import { ReactElement } from 'react'
import Box from '@mui/material/Box'
import { BoxTypeMap } from '@mui/material/Box/Box'

export const AppBox = <P extends {}, D extends React.ElementType = 'div'>(props: BoxTypeMap<P, D>['props']): ReactElement => {
  return (
    <Box {...props} />
  )
}
