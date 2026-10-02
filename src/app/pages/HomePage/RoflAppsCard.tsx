import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LatestRoflAppsContent } from '../ParatimeDashboardPage/LatestRoflApps'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { isLocalnetEnabled, RouteUtils } from '../../utils/route-utils'
import { RuntimeScope } from '../../../types/searchScope'
import { Link as RouterLink } from 'react-router'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

export const RoflAppsCard: FC = () => {
  const { t } = useTranslation()
  const localnetEnabled = isLocalnetEnabled()
  // ROFL apps only exist on Sapphire
  const scope: RuntimeScope = { network: localnetEnabled ? 'localnet' : 'mainnet', layer: 'sapphire' }

  if (localnetEnabled && !RouteUtils.getAllLayersForNetwork('localnet').enabled.includes(scope.layer)) {
    return null
  }

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('rofl.listTitle')}</Typography>
          <Link asChild textColor="primary" className="font-medium px-4">
            <RouterLink to={RouteUtils.getRoflAppsRoute(scope.network)}>{t('common.viewAll')}</RouterLink>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light>
          <LatestRoflAppsContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
