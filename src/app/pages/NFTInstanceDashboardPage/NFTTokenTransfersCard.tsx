import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { TokenTransfers } from '../../components/Tokens/TokenTransfers'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { NftDashboardContext } from './'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useNFTInstanceTransfers } from '../TokenDashboardPage/hook'

export const nftTokenTransfersContainerId = 'nftTokenTransfers'

export const NFTTokenTransfersCard: FC<NftDashboardContext> = props => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={nftTokenTransfersContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.transfers')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <NFTTokenTransfersView {...props} />
        </ErrorBoundary>
      </CardContent>
    </Card>
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
