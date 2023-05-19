import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { Layer } from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { Network } from '../../../types/network'

export const BlockLink: FC<{ network: Network; layer: Layer; height: number }> = ({
  network,
  layer,
  height,
}) => (
  <Typography variant="mono">
    <Link component={RouterLink} to={RouteUtils.getBlockRoute(network, height, layer)}>
      {height.toLocaleString()}
    </Link>
  </Typography>
)

export const BlockHashLink: FC<{ network: Network; layer: Layer; hash: string; height: number }> = ({
  network,
  layer,
  hash,
  height,
}) => (
  <Typography variant="mono">
    <TrimLinkLabel label={hash} to={RouteUtils.getBlockRoute(network, height, layer)} />
  </Typography>
)
