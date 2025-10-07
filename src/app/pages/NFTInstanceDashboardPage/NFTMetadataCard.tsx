import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { NftDashboardContext } from '../NFTInstanceDashboardPage'
import { CodeDisplay } from '../../components/CodeDisplay'
import { useNFTInstance } from '../TokenDashboardPage/hook'
import { metadataContainerId } from '../../utils/tabAnchors'

export const NFTMetadataCard: FC<NftDashboardContext> = ({ scope, address, instanceId }) => {
  const { t } = useTranslation()
  const { isFetched, nft } = useNFTInstance(scope, address, instanceId)
  const metadata = nft?.metadata

  return (
    <Card>
      {isFetched && !metadata && <CardEmptyState label={t('nft.noMetadata')} />}
      <>
        {metadata && (
          <CardContent>
            <LinkableDiv id={metadataContainerId}>
              <CodeDisplay
                code={JSON.stringify(metadata, null, 2)}
                label={t('nft.metadata')}
                language="json"
              />
            </LinkableDiv>
          </CardContent>
        )}
      </>
    </Card>
  )
}
