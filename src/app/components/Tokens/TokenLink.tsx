import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'

import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { HighlightedText, HighlightPattern } from '../HighlightedText'

export const TokenLink: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
  highlightPattern?: HighlightPattern
}> = ({ scope, address, name, highlightPattern }) => {
  return (
    <Link component={RouterLink} to={RouteUtils.getTokenRoute(scope, address)}>
      {name ? <HighlightedText text={name} pattern={highlightPattern} /> : address}
    </Link>
  )
}
