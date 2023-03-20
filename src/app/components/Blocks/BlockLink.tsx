import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { Layer } from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'
import { TrimLinkLabel } from '../TrimLinkLabel'

export const BlockLink: FC<{ layer: Layer; height: number }> = ({ layer, height }) => (
  <Typography variant="mono">
    <Link component={RouterLink} to={RouteUtils.getBlockRoute(height, layer)}>
      {height.toLocaleString()}
    </Link>
  </Typography>
)

export const BlockHashLink: FC<{ layer: Layer; hash: string; height: number }> = ({
  layer,
  hash,
  height,
}) => (
  <Typography variant="mono">
    <TrimLinkLabel label={hash} to={RouteUtils.getBlockRoute(height, layer)} />
  </Typography>
)
