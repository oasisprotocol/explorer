import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-nexus/api'
import { RuntimeTransactions } from '../../components/Transactions'
import { FILTERING_ON_DASHBOARD, NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeTransactionTypeFilter } from '../../components/Transactions/RuntimeTransactionTypeFilter'
import Box from '@mui/material/Box'
import { getRuntimeTransactionMethodFilteringParam } from '../../components/RuntimeTransactionMethod'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD
const shouldFilter = FILTERING_ON_DASHBOARD

export const LatestRuntimeTransactions: FC<{
  scope: SearchScope
  method: string
  setMethod: (value: string) => void
}> = ({ scope, method, setMethod }) => {
  const { isMobile, isTablet } = useScreenSize()
  const { t } = useTranslation()
  const { network, layer } = scope
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet supported.
    // We should use useGetConsensusTransactions()
  }

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
              <RuntimeTransactionTypeFilter layer={layer} value={method} setValue={setMethod} />
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
        <RuntimeTransactionTypeFilter layer={layer} value={method} setValue={setMethod} expand />
      )}
      <CardContent>
        <RuntimeTransactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={false}
          verbose={!isTablet}
          filtered={method !== 'any'}
        />
      </CardContent>
    </Card>
  )
}
