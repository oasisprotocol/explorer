import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Runtime, useGetRuntimeEvmTokensAddressNftsId } from '../../../oasis-nexus/api'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from './../AccountDetailsPage/CardEmptyState'
import { NftDashboardContext } from '../NFTInstanceDashboardPage'
import { JsonCodeDisplay } from '../../components/CodeDisplay'

export const nftMetadataId = 'metadata'

export const NFTMetadataCard: FC<NftDashboardContext> = ({ scope, address, instanceId }) => {
  const { t } = useTranslation()
  const { data, isFetched } = useGetRuntimeEvmTokensAddressNftsId(
    scope.network,
    scope.layer as Runtime,
    address,
    instanceId,
  )
  const metadata = data?.data?.metadata

  return (
    <Card>
      {isFetched && !metadata && <CardEmptyState label={t('nft.noMetadata')} />}
      <>
        {metadata && (
          <CardContent>
            <LinkableDiv id={nftMetadataId}>
              <JsonCodeDisplay data={metadata} label={t('nft.metadata')} />
            </LinkableDiv>
          </CardContent>
        )}
      </>
    </Card>
  )
}
