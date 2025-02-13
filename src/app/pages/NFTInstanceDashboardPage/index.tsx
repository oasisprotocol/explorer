import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams, useOutletContext } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { InstanceTitleCard } from './InstanceTitleCard'
import { InstanceDetailsCard } from './InstanceDetailsCard'
import { InstanceImageCard } from './InstanceImageCard'
import { AppErrors } from '../../../types/errors'
import { RouterTabs } from 'app/components/RouterTabs'
import { SearchScope } from '../../../types/searchScope'
import { useNFTInstance } from '../TokenDashboardPage/hook'
import { metadataContainerId } from '../../utils/tabAnchors'

export type NftDashboardContext = {
  scope: SearchScope
  address: string
  instanceId: string
}

export const useNftDetailsProps = () => useOutletContext<NftDashboardContext>()

export const NFTInstanceDashboardPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const { address, instanceId } = useParams()
  if (!address || !instanceId) {
    throw AppErrors.InvalidUrl
  }
  const { isFetched, isLoading, nft } = useNFTInstance(scope, address, instanceId)

  const tokenTransfersLink = useHref('')
  const metadataLink = useHref(`metadata#${metadataContainerId}`)
  const context: NftDashboardContext = {
    scope,
    address,
    instanceId,
  }
  return (
    <PageLayout>
      <InstanceTitleCard isFetched={isFetched} isLoading={isLoading} nft={nft} scope={scope} />
      <InstanceImageCard isFetched={isFetched} isLoading={isLoading} nft={nft} />
      <InstanceDetailsCard
        isFetched={isFetched}
        isLoading={isLoading}
        nft={nft}
        scope={scope}
        contractAddress={address!}
      />
      <RouterTabs
        tabs={[
          { label: t('common.transfers'), to: tokenTransfersLink },
          { label: t('nft.metadata'), to: metadataLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}
