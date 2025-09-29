import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { RuntimeScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as limit, paraTimesConfig } from '../../../config'
import { AppErrors } from '../../../types/errors'
import { RouteUtils } from '../../utils/route-utils'
import { RoflAppsList } from '../../components/Rofl/RoflAppsList'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const LatestRoflAppsContent: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { network, layer } = scope
  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer
  const roflAppsQuery = useGetRuntimeRoflApps(network, layer, { limit })
  const { isLoading, data } = roflAppsQuery
  const roflApps = data?.data.rofl_apps
  if (!roflApps?.length) {
    return null
  }
  return <RoflAppsList apps={roflApps} isLoading={isLoading} limit={limit} pagination={false} />
}

export const LatestRoflApps: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { layer } = scope
  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <Typography variant="h3">{t('rofl.listTitle')}</Typography>
        <Link asChild className="font-medium px-4" textColor="primary">
          <RouterLink to={RouteUtils.getRoflAppsRoute(scope.network)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>
      <CardContent>
        <ErrorBoundary light>
          <LatestRoflAppsContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
