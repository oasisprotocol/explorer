import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useAccount } from '../RuntimeAccountDetailsPage/hook'
import { useTokenInfo, useTokenTransfers } from './hook'
import { TokenDashboardContext } from './index'

export const tokenTransfersContainerId = 'tokenTransfers'

export const TokenTransfersCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout containerId={tokenTransfersContainerId} title={t('common.transfers')}>
      <TokenTransfersView scope={scope} address={address} />
    </LinkableCardLayout>
  )
}

const TokenTransfersView: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading: areTransfersLoading, isFetched, results } = useTokenTransfers(scope, { address })

  const { isLoading: isTokenLoading } = useTokenInfo(scope, address)

  const { isLoading: isAccountLoading, account } = useAccount(scope, address)

  const isLoading = isTokenLoading || isAccountLoading || areTransfersLoading
  const transfers = results.data

  return (
    <>
      {isFetched && !transfers?.length && <CardEmptyState label={t('account.emptyTokenTransferList')} />}
      <TokenTransfers
        transfers={transfers}
        ownAddress={account?.address_eth}
        isLoading={isLoading}
        limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
        pagination={results.tablePaginationProps}
      />
    </>
  )
}
