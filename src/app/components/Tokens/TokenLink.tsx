import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { HighlightedText } from '../HighlightedText'

export const TokenLink: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
}> = ({ scope, address, name }) => {
  return (
    <Link asChild className="font-medium">
      <RouterLink to={RouteUtils.getTokenRoute(scope, address)}>
        {name ? <HighlightedText text={name} /> : address}
      </RouterLink>
    </Link>
  )
}
