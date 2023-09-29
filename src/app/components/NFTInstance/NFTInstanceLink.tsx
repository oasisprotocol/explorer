import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import { EvmNft } from '../../../oasis-nexus/api'
import { getNFTInstanceLabel } from '../../../types/tokens'

export const NFTInstanceLink: FC<{
  scope: SearchScope
  contractAddress: string
  instanceId: string
  label: string
}> = ({ scope, contractAddress, instanceId, label }) => {
  const to = RouteUtils.getNFTInstanceRoute(scope, contractAddress, instanceId)
  return (
    <Typography variant="mono" component="span" sx={{ color: COLORS.grayExtraDark, fontWeight: 400 }}>
      <Link component={RouterLink} to={to}>
        {label}
      </Link>
    </Typography>
  )
}

export const NFTInstanceLinkFor: FC<{ scope: SearchScope; instance: EvmNft }> = ({ scope, instance }) => (
  <NFTInstanceLink
    scope={scope}
    contractAddress={instance.contract_addr}
    instanceId={instance.id}
    label={getNFTInstanceLabel(instance)}
  />
)
