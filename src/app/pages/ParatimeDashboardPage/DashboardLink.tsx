import { FC } from 'react'
import { getNameForScope, SearchScope } from '../../../types/searchScope'
import { RouteUtils } from '../../utils/route-utils'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const DashboardLink: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  return (
    <Link asChild className="font-medium">
      <RouterLink to={RouteUtils.getDashboardRoute(scope)}>{getNameForScope(t, scope)}</RouterLink>
    </Link>
  )
}
