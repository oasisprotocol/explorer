import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { NftDashboardContext } from './'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useNFTInstanceTransfers } from '../TokenDashboardPage/hook'
import { nftTokenTransfersContainerId } from '../../utils/tabAnchors'

export const NFTTokenTransfersCard: FC<NftDashboardContext> = props => {
  const { t } = useTranslation()

  return (
    <LinkableCardLayout containerId={nftTokenTransfersContainerId} title={t('common.transfers')}>
      <NFTTokenTransfersView {...props} />
    </LinkableCardLayout>
  )
}

const NFTTokenTransfersView: FC<NftDashboardContext> = ({ scope, address, instanceId }) => {
  const { t } = useTranslation()
  const { isLoading, isFetched, results } = useNFTInstanceTransfers(scope, {
    contract_address: address,
    nft_id: instanceId,
  })
  const transfers = results.data

  return (
    <>
      {isFetched && !transfers?.length && <CardEmptyState label={t('account.emptyTokenTransferList')} />}
      <TokenTransfers
        transfers={transfers}
        isLoading={isLoading}
        limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
        pagination={results.tablePaginationProps}
      />
    </>
  )
}
