import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import { CardEmptyState } from '../AccountDetailsPage/CardEmptyState'
import { useTokenHolders, useTokenInfo } from './hook'
import { TokenHolders } from '../../components/Tokens/TokenHolders'

export const tokenHoldersContainerId = 'holders'

export const TokenHoldersCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string

  const { token } = useTokenInfo(scope, address)

  const { isLoading, isFetched, holders, pagination, totalCount, isTotalCountClipped } = useTokenHolders(
    scope,
    address,
  )

  return (
    <Card>
      <LinkableDiv id={tokenHoldersContainerId}>
        <CardHeader disableTypography component="h3" title={t('tokens.holders')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          {isFetched && !totalCount && <CardEmptyState label={t('tokens.emptyTokenHolderList')} />}
          <TokenHolders
            holders={holders}
            decimals={token?.decimals}
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
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
