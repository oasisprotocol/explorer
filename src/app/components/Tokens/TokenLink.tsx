import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'

import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { HighlightedText } from '../HighlightedText'

export const TokenLink: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
  highlightedPart?: string | undefined
}> = ({ scope, address, name, highlightedPart }) => {
  return (
    <Link component={RouterLink} to={RouteUtils.getTokenRoute(scope, address)}>
      {name ? <HighlightedText text={name} pattern={highlightedPart} /> : address}
    </Link>
  )
}
