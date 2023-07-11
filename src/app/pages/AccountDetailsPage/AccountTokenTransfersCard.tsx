import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from './CardEmptyState'
import { useAccount, useAccountTokenTransfers } from './hook'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { useOutletContext } from 'react-router-dom'
import { AccountDetailsContext } from './index'

export const accountTokenTransfersContainerId = 'transfers'

export const AccountTokenTransfersCard: FC = () => {
  const { t } = useTranslation()
  const { scope, address } = useOutletContext<AccountDetailsContext>()

  const { isLoading, isFetched, transfers, pagination, totalCount, isTotalCountClipped } =
    useAccountTokenTransfers(scope, address)

  const { account } = useAccount(scope, address)

  return (
    <Card>
      <LinkableDiv id={accountTokenTransfersContainerId}>
        <CardHeader disableTypography component="h3" title={t('tokens.transfers')} />
      </LinkableDiv>
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
            differentTokens
          />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
