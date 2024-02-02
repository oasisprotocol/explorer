import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetConsensusAccounts } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import { AccountList } from 'app/components/AccountList'
import { RouteUtils } from 'app/utils/route-utils'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const AccountsCard: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope
  // TODO: Add query param to sort by rank when API is ready
  const accountsQuery = useGetConsensusAccounts(network, { limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('account.listTitle')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getAccountsRoute(scope.network)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <AccountList
          accounts={accountsQuery.data?.data.accounts}
          isLoading={accountsQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
