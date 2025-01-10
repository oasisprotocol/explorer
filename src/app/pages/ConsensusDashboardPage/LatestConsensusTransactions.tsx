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
import { NUMBER_OF_ITEMS_ON_DASHBOARD as limit, FILTERING_ON_DASHBOARD as shouldFilter } from '../../config'
import { RouteUtils } from '../../utils/route-utils'
import {
  getConsensusTransactionMethodFilteringParam,
  ConsensusTxMethodFilterOption,
} from '../../components/ConsensusTransactionMethod'
import Box from '@mui/material/Box'
import { ConsensusTransactionTypeFilter } from '../../components/Transactions/ConsensusTransactionTypeFilter'
import { useScreenSize } from '../../hooks/useScreensize'

export const LatestConsensusTransactions: FC<{
  scope: SearchScope
  method: ConsensusTxMethodFilterOption
  setMethod: (value: ConsensusTxMethodFilterOption) => void
}> = ({ scope, method, setMethod }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const { network } = scope

  const transactionsQuery = useGetConsensusTransactions(
    network,
    {
      ...getConsensusTransactionMethodFilteringParam(method),
      limit,
    },
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
        title={
          <Box
            sx={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            {t('transactions.latest')}
            {shouldFilter && !isMobile && (
              <ConsensusTransactionTypeFilter value={method} setValue={setMethod} />
            )}
          </Box>
        }
        action={
          <Link component={RouterLink} to={RouteUtils.getLatestTransactionsRoute(scope)}>
            {t('common.viewAll')}
          </Link>
        }
      />
      {shouldFilter && isMobile && (
        <ConsensusTransactionTypeFilter value={method} setValue={setMethod} expand />
      )}
      <CardContent>
        <ConsensusTransactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={false}
          verbose={false}
          filtered={method !== 'any'}
        />
      </CardContent>
    </Card>
  )
}
