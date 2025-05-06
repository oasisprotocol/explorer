import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useTokenHolders, useTokenInfo } from './hook'
import { TokenHolders } from '../../components/Tokens/TokenHolders'
import { TokenDashboardContext } from './index'
import { holdersContainerId } from '../../utils/tabAnchors'

export const TokenHoldersCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  return (
    <LinkableCardLayout containerId={holdersContainerId} title="">
      <TokenHoldersView scope={scope} address={address} />
    </LinkableCardLayout>
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
