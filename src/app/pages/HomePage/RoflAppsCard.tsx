import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { LatestRoflAppsContent } from '../ParatimeDashboardPage/LatestRoflApps'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const RoflAppsCard: FC = () => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>{t('rofl.listTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light>
          <LatestRoflAppsContent scope={{ network: 'mainnet', layer: 'sapphire' }} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
