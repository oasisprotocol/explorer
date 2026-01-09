import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetConsensusAccounts } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { ConsensusScope } from '../../../types/searchScope'
import { AccountList } from 'app/components/AccountList'
import { RouteUtils } from 'app/utils/route-utils'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const AccountsContent: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { network } = scope
  // TODO: Add query param to sort by rank when API is ready
  const accountsQuery = useGetConsensusAccounts(network, { limit })
  return (
    <AccountList
      accounts={accountsQuery.data?.data.accounts}
      isLoading={accountsQuery.isLoading}
      limit={limit}
      pagination={false}
    />
  )
}

export const AccountsCard: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { t } = useTranslation()
  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('account.listTitle')}</Typography>
          <Link asChild textColor="primary" className="font-medium px-4">
            <RouterLink to={RouteUtils.getAccountsRoute(scope.network)}>{t('common.viewAll')}</RouterLink>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light={true}>
          <AccountsContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
