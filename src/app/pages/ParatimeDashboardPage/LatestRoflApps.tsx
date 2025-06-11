import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { RuntimeScope } from '../../../types/searchScope'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as limit, paraTimesConfig } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
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
      <CardHeader
        disableTypography
        component="h3"
        title={t('rofl.listTitle')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getRoflAppsRoute(scope.network)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <ErrorBoundary light>
          <LatestRoflAppsContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
