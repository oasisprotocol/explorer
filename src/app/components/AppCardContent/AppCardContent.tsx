import { ReactElement } from 'react'
import CardContent from '@mui/material/CardContent'
import * as React from 'react'
import { CardContentTypeMap } from '@mui/material/CardContent/CardContent'

export const AppCardContent = <P extends {}, D extends React.ElementType = 'div'>(props: CardContentTypeMap<P, D>['props']): ReactElement => {
  return (
    <CardContent {...props} />
  )
}
