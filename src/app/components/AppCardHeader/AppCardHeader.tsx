import { ReactElement } from 'react'
import CardHeader from '@mui/material/CardHeader'
import { CardHeaderTypeMap } from '@mui/material/CardHeader/CardHeader'

export const AppCardHeader = <Props extends {},
  DefaultComponent extends React.ElementType = 'div',
  TitleTypographyComponent extends React.ElementType = 'span',
  SubheaderTypographyComponent extends React.ElementType = 'span'>(props: CardHeaderTypeMap<Props, DefaultComponent, TitleTypographyComponent, SubheaderTypographyComponent>['props']): ReactElement => {
  return (
    <CardHeader {...props} />
  )
}
