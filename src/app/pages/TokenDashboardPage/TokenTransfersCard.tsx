import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { useAccount } from '../AccountDetailsPage/hook'
import { useTokenInfo, useTokenTransfers } from './hook'
import { TokenDashboardContext } from './index'

export const tokenTransfersContainerId = 'transfers'

export const TokenTransfersCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading: areTransfersLoading, isFetched, results } = useTokenTransfers(scope, address)

  const { isLoading: isTokenLoading } = useTokenInfo(scope, address)

  const { isLoading: isAccountLoading, account } = useAccount(scope, address)

  const isLoading = isTokenLoading || isAccountLoading || areTransfersLoading
  const transfers = results.data

  return (
    <Card>
      <CardHeader disableTypography component="h3" title={t('tokens.transfers')} />
      <CardContent>
        <ErrorBoundary light={true}>
          {isFetched && !transfers?.length && <CardEmptyState label={t('account.emptyTokenTransferList')} />}
          <TokenTransfers
            transfers={transfers}
            ownAddress={account?.address_eth}
            isLoading={isLoading}
            limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
            pagination={results.tablePaginationProps}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
