import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import Link from '@mui/material/Link'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { Network } from '../../../types/network'

type ValidatorLinkProps = {
  address: string
  name?: string
  network: Network
}

export const ValidatorLink: FC<ValidatorLinkProps> = ({ address, name, network }) => {
  const { isTablet } = useScreenSize()
  const to = RouteUtils.getValidatorRoute(network, address)
  return (
    <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
      {isTablet ? (
        <TrimLinkLabel label={address} to={to} />
      ) : (
        <Link component={RouterLink} to={to}>
          {name || address}
        </Link>
      )}
    </Typography>
  )
}
