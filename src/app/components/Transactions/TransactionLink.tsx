import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { TrimLinkLabel } from '../TrimLinkLabel'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'

export const TransactionLink: FC<{
  alwaysTrim?: boolean
  scope: SearchScope
  hash: string
  plain?: boolean
}> = ({ alwaysTrim, hash, scope, plain }) => {
  const { isMobile } = useScreenSize()
  const to = RouteUtils.getTransactionRoute(scope, hash)

  return (
    <Typography variant="mono">
      {alwaysTrim || isMobile ? (
        <TrimLinkLabel label={hash} to={to} plain={plain} />
      ) : (
        <Link component={RouterLink} to={to} sx={{ fontWeight: plain ? 400 : undefined }}>
          {hash}
        </Link>
      )}
    </Typography>
  )
}
