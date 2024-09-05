import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { ConsensusTransactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as limit } from '../../config'
import { RouteUtils } from '../../utils/route-utils'

export const LatestConsensusTransactions: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope

  const transactionsQuery = useGetConsensusTransactions(
    network,
    { limit },
    {
      query: {
        cacheTime: 0,
      },
    },
  )

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('transactions.latest')}
        action={
          <Link component={RouterLink} to={RouteUtils.getLatestTransactionsRoute(scope)}>
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <ConsensusTransactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={false}
          verbose={false}
        />
      </CardContent>
    </Card>
  )
}
