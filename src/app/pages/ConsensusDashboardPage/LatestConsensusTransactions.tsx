import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetConsensusTransactions } from '../../../oasis-nexus/api'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusTransactions } from '../../components/Transactions'
import {
  NUMBER_OF_ITEMS_ON_DASHBOARD as limit,
  FILTERING_ON_DASHBOARD as shouldFilter,
} from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import {
  getConsensusTransactionMethodFilteringParam,
  ConsensusTxMethodFilterOption,
} from '../../components/ConsensusTransactionMethod'
import Box from '@mui/material/Box'
import { ConsensusTransactionTypeFilter } from '../../components/Transactions/ConsensusTransactionTypeFilter'
import { useScreenSize } from '../../hooks/useScreensize'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'

const LatestConsensusTransactionsContent: FC<{
  scope: ConsensusScope
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: ParamSetterFunction<ConsensusTxMethodFilterOption>
}> = ({ scope, txMethod }) => {
  const { network } = scope

  const transactionsQuery = useGetConsensusTransactions(
    network,
    {
      ...getConsensusTransactionMethodFilteringParam(txMethod),
      limit,
    },
    {
      query: {
        cacheTime: 0,
      },
    },
  )

  return (
    <ConsensusTransactions
      transactions={transactionsQuery.data?.data.transactions}
      isLoading={transactionsQuery.isLoading}
      limit={limit}
      pagination={false}
      verbose={false}
      filtered={txMethod !== 'any'}
    />
  )
}

export const LatestConsensusTransactions: FC<{
  scope: ConsensusScope
  txMethod: ConsensusTxMethodFilterOption
  setTxMethod: ParamSetterFunction<ConsensusTxMethodFilterOption>
}> = ({ scope, txMethod, setTxMethod }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
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
              <ConsensusTransactionTypeFilter value={txMethod} setValue={setTxMethod} />
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
        <ConsensusTransactionTypeFilter value={txMethod} setValue={setTxMethod} expand />
      )}
      <CardContent>
        <ErrorBoundary light={true}>
          <LatestConsensusTransactionsContent scope={scope} txMethod={txMethod} setTxMethod={setTxMethod} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
