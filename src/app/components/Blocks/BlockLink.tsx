import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { RouteUtils } from '../../utils/route-utils'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { SearchScope } from '../../../types/searchScope'

export const BlockLink: FC<{ scope: SearchScope; height: number }> = ({ scope, height }) => (
  <Typography variant="mono">
    <Link component={RouterLink} to={RouteUtils.getBlockRoute(scope, height)}>
      {height.toLocaleString()}
    </Link>
  </Typography>
)

export const BlockHashLink: FC<{ scope: SearchScope; hash: string; height: number }> = ({
  scope,
  hash,
  height,
}) => (
  <Typography variant="mono">
    <TrimLinkLabel label={hash} to={RouteUtils.getBlockRoute(scope, height)} />
  </Typography>
)
