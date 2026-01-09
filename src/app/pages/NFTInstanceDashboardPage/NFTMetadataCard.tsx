import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { NftDashboardContext } from '../NFTInstanceDashboardPage/types'
import { CodeDisplay } from '../../components/CodeDisplay'
import { useNFTInstance } from '../TokenDashboardPage/hooks'
import { metadataContainerId } from '../../utils/tabAnchors'

export const NFTMetadataCard: FC<NftDashboardContext> = ({ scope, address, instanceId }) => {
  const { t } = useTranslation()
  const { isFetched, nft } = useNFTInstance(scope, address, instanceId)
  const metadata = nft?.metadata

  return (
    <Card variant="layout">
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
