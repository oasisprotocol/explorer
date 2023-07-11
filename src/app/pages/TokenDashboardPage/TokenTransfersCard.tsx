import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { useOutletContext } from 'react-router-dom'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { useAccount } from '../AccountDetailsPage/hook'
import { useTokenInfo, useTokenTransfers } from './hook'
import { TokenDashboardContext } from './index'

export const tokenTransfersContainerId = 'transfers'

export const TokenTransfersCard: FC = () => {
  const { t } = useTranslation()
  const { scope, address } = useOutletContext<TokenDashboardContext>()

  const {
    isLoading: areTransfersLoading,
    isFetched,
    transfers,
    pagination,
    totalCount,
    isTotalCountClipped,
  } = useTokenTransfers(scope, address)

  const { isLoading: isTokenLoading } = useTokenInfo(scope, address)

  const { isLoading: isAccountLoading, account } = useAccount(scope, address)

  const isLoading = isTokenLoading || isAccountLoading || areTransfersLoading

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
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount,
              isTotalCountClipped,
              rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
            }}
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
