import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { useTokenHolders, useTokenInfo } from './hook'
import { TokenHolders } from '../../components/Tokens/TokenHolders'
import { TokenDashboardContext } from './index'

export const tokenHoldersContainerId = 'holders'

export const TokenHoldersCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={tokenHoldersContainerId}>
        <CardHeader disableTypography component="h3" title={t('tokens.holders')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <TokenHoldersView scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const TokenHoldersView: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading: isTokenLoading, token } = useTokenInfo(scope, address)

  const {
    isLoading: areHoldersLoading,
    isFetched,
    holders,
    pagination,
    totalCount,
    isTotalCountClipped,
  } = useTokenHolders(scope, address)

  const isLoading = isTokenLoading || areHoldersLoading

  return (
    <>
      {isFetched && !totalCount && <CardEmptyState label={t('tokens.emptyTokenHolderList')} />}
      <TokenHolders
        holders={holders}
        decimals={token?.decimals ?? 0}
        totalSupply={token?.total_supply}
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
    </>
  )
}
