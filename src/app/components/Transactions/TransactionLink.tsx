import React, { FC } from 'react'
import { Layer } from '../../../oasis-indexer/api'
import Typography from '@mui/material/Typography'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'

export const TransactionLink: FC<{ layer: Layer; hash: string }> = ({ layer, hash }) => (
  <Typography variant="mono">
    <TrimLinkLabel label={hash} to={RouteUtils.getTransactionRoute(hash, layer)} />
  </Typography>
)
