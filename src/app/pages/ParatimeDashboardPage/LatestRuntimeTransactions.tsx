import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { RuntimeTransactions } from '../../components/Transactions'
import { FILTERING_ON_DASHBOARD, NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeScope } from '../../../types/searchScope'
import { RuntimeTransactionMethodFilter } from '../../components/Transactions/RuntimeTransactionMethodFilter'
import Box from '@mui/material/Box'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ParamSetterFunction } from '../../hooks/useTypedSearchParam'
import { RuntimeTxMethodFilteringType } from '../../hooks/useCommonParams'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD
const shouldFilter = FILTERING_ON_DASHBOARD

const LatestRuntimeTransactionsContent: FC<{
  scope: RuntimeScope
  method: string
  setMethod: (value: string) => void
}> = ({ scope, method }) => {
  const { isTablet } = useScreenSize()
  const { network, layer } = scope

  const transactionsQuery = useGetRuntimeTransactions(
    network,
    layer,
    {
      ...getRuntimeTransactionMethodFilteringParam(method),
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
      filtered={method !== 'any'}
    />
  )
}

export const LatestRuntimeTransactions: FC<{
  scope: RuntimeScope
  method: RuntimeTxMethodFilteringType
  setMethod: ParamSetterFunction<RuntimeTxMethodFilteringType>
}> = ({ scope, method, setMethod }) => {
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const { layer } = scope

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
              <RuntimeTransactionMethodFilter layer={layer} value={method} setValue={setMethod} />
            )}
          </Box>
        }
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getLatestTransactionsRoute(scope)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      {shouldFilter && isMobile && (
        <RuntimeTransactionMethodFilter layer={layer} value={method} setValue={setMethod} expand />
      )}
      <CardContent>
        <ErrorBoundary light>
          <LatestRuntimeTransactionsContent scope={scope} method={method} setMethod={setMethod} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
