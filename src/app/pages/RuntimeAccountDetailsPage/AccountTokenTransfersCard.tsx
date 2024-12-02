import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useTokenTransfers } from '../TokenDashboardPage/hook'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { RuntimeAccountDetailsContext } from './index'

export const accountTokenTransfersContainerId = 'transfers'

export const AccountTokenTransfersCard: FC<RuntimeAccountDetailsContext> = ({ scope, address, account }) => {
  const { t } = useTranslation()
  return (
    <LinkableCardLayout containerId={accountTokenTransfersContainerId} title={t('common.transfers')}>
      <AccountTokenTransfers scope={scope} address={address} account={account} />
    </LinkableCardLayout>
  )
}

const AccountTokenTransfers: FC<RuntimeAccountDetailsContext> = ({ scope, address, account }) => {
  const { t } = useTranslation()
  const { isLoading, isFetched, results } = useTokenTransfers(scope, { rel: address })

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
        differentTokens
      />
    </>
  )
}
