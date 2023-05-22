import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Layer } from '../../../oasis-indexer/api'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { Network } from '../../../types/network'

export const TransactionLink: FC<{ alwaysTrim?: boolean; network: Network; layer: Layer; hash: string }> = ({
  alwaysTrim,
  hash,
  network,
  layer,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const to = RouteUtils.getTransactionRoute(network, hash, layer)

  return (
    <Typography variant="mono">
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={hash} to={to} />
      ) : (
        <Link component={RouterLink} to={to}>
          {hash}
        </Link>
      )}
    </Typography>
  )
}
