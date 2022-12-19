import Link, { LinkTypeMap } from '@mui/material/Link'
import { ReactElement } from 'react'

export const AppLink = <P extends {}, D extends React.ElementType = 'a'>(props: LinkTypeMap<P, D>['props']): ReactElement => {
  return (
    <Link {...props} />
  )
}
