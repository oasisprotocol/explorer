import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { Layer, useGetRuntimeTransactions } from '../../../oasis-indexer/api'
import { Transactions } from '../../components/Transactions'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const LatestTransactions: FC = () => {
  const { t } = useTranslation()
  const layer = useLayerParam()
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus transactions is not yet supported.
    // We should use useGetConsensusTransactions()
  }
  const transactionsQuery = useGetRuntimeTransactions(layer, { limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('transactions.latest')}
        action={
          <Link component={RouterLink} to="transactions" sx={{ color: COLORS.brandExtraDark }}>
            View all
          </Link>
        }
      />
      <CardContent>
        <Transactions
          transactions={transactionsQuery.data?.data.transactions}
          isLoading={transactionsQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
