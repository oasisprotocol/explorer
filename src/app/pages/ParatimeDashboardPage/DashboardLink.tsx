import { FC } from 'react'
import { getNameForScope, SearchScope } from '../../../types/searchScope'
import Typography from '@mui/material/Typography'
import { RouteUtils } from '../../utils/route-utils'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const DashboardLink: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  return (
    <Typography variant="mono">
      <Link component={RouterLink} to={RouteUtils.getDashboardRoute(scope)}>
        {getNameForScope(t, scope)}
      </Link>
    </Typography>
  )
}
