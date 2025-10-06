import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { RuntimeTransactions } from '../../components/Transactions'
import { FILTERING_ON_DASHBOARD, NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeScope } from '../../../types/searchScope'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD
const shouldFilter = FILTERING_ON_DASHBOARD

const LatestRuntimeTransactionsContent: FC<{
  scope: RuntimeScope
  txMethod: string
}> = ({ scope, txMethod }) => {
  const { isTablet } = useScreenSize()
  const { network, layer } = scope

  const transactionsQuery = useGetRuntimeTransactions(
    network,
    layer,
    {
      ...getRuntimeTransactionMethodFilteringParam(txMethod),
      limit,
    },
    {
      query: {
        cacheTime: 0,
      },
    },
  )

  return (
    <RuntimeTransactions
      transactions={transactionsQuery.data?.data.transactions}
      isLoading={transactionsQuery.isLoading}
      limit={limit}
      pagination={false}
      verbose={!isTablet}
      filtered={txMethod !== 'any'}
    />
  )
}

export const LatestRuntimeTransactions: FC<{
  scope: RuntimeScope
  txMethod: RuntimeTxMethodFilteringType
  setTxMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
}> = ({ scope, txMethod, setTxMethod }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const { layer } = scope

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <div className="flex items-center gap-6">
          <Typography variant="h3">{t('transactions.latest')}</Typography>
          {shouldFilter && !isMobile && (
            <RuntimeTransactionMethodFilter layer={layer} value={txMethod} setValue={setTxMethod} />
          )}
        </div>
        <Link asChild className="font-medium px-4" textColor="primary">
          <RouterLink to={RouteUtils.getLatestTransactionsRoute(scope)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>
      {shouldFilter && isMobile && (
        <RuntimeTransactionMethodFilter layer={layer} value={txMethod} setValue={setTxMethod} expand />
      )}
      <CardContent>
        <ErrorBoundary light>
          <LatestRuntimeTransactionsContent scope={scope} txMethod={txMethod} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
