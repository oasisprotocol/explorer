import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'

export const TransactionLink: FC<{
  alwaysTrim?: boolean
  scope: SearchScope
  hash: string
  plain?: boolean
}> = ({ alwaysTrim, hash, scope, plain }) => {
  const { isMobile } = useScreenSize()
  const to = RouteUtils.getTransactionRoute(scope, hash)

  return (
    <Typography variant="mono" sx={{ ...(plain ? { color: COLORS.grayExtraDark, fontWeight: 400 } : {}) }}>
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={hash} to={to} plain={plain} />
      ) : plain ? (
        hash
      ) : (
        <Link component={RouterLink} to={to}>
          {hash}
        </Link>
      )}
    </Typography>
  )
}
