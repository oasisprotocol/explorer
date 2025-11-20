import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LatestRoflAppsContent } from '../ParatimeDashboardPage/LatestRoflApps'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { RouteUtils } from '../../utils/route-utils'
import { Link as RouterLink } from 'react-router-dom'

export const RoflAppsCard: FC = () => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <div>
            <RouterLink to={RouteUtils.getRoflAppsRoute('mainnet')}>{t('rofl.listTitle')}</RouterLink>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light>
          <LatestRoflAppsContent scope={{ network: 'mainnet', layer: 'sapphire' }} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
