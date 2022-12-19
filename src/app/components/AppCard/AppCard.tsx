import { ReactElement } from 'react'
import Card from '@mui/material/Card'
import { CardTypeMap } from '@mui/material/Card/Card'

export const AppCard = <P extends {}, D extends React.ElementType = 'div'>(props: CardTypeMap<P, D>['props']): ReactElement => {
  return (
    <Card {...props} />
  )
}
