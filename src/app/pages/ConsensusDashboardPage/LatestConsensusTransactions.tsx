import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
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

import { ConsensusTransactionMethodFilter } from '../../components/Transactions/ConsensusTransactionMethodFilter'
import { useScreenSize } from '../../hooks/useScreensize'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

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
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <div className="flex items-center gap-6">
          <Typography variant="h3">{t('transactions.latest')}</Typography>
          {shouldFilter && !isMobile && (
            <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} />
          )}
        </div>
        <Link asChild className="font-medium px-4" textColor="primary">
          <RouterLink to={RouteUtils.getLatestTransactionsRoute(scope)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>

      {shouldFilter && isMobile && (
        <ConsensusTransactionMethodFilter value={txMethod} setValue={setTxMethod} expand />
      )}
      <CardContent>
        <ErrorBoundary light={true}>
          <LatestConsensusTransactionsContent scope={scope} txMethod={txMethod} setTxMethod={setTxMethod} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
