import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'

import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'

export const TokenLink: FC<{ scope: SearchScope; address: string; name: string | undefined }> = ({
  scope,
  address,
  name,
}) => {
  return (
    <Link component={RouterLink} to={RouteUtils.getTokenRoute(scope, address)}>
      {name || address}
    </Link>
  )
}
