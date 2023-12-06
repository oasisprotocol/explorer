import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams, useOutletContext } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { InstanceTitleCard } from './InstanceTitleCard'
import { InstanceDetailsCard } from './InstanceDetailsCard'
import { InstanceImageCard } from './InstanceImageCard'
import { Layer, Runtime, useGetRuntimeEvmTokensAddressNftsId } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { RouterTabs } from 'app/components/RouterTabs'
import { SearchScope } from '../../../types/searchScope'

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
  if (scope.layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }

  if (!address || !instanceId) {
    throw AppErrors.InvalidUrl
  }

  const { data, isError, isFetched, isLoading } = useGetRuntimeEvmTokensAddressNftsId(
    scope.network,
    scope.layer as Runtime,
    address,
    instanceId,
  )
  if (isError) {
    throw AppErrors.InvalidAddress
  }
  const nft = data?.data
  const metadataLink = useHref('')
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
      <RouterTabs tabs={[{ label: t('nft.metadata'), to: metadataLink }]} context={context} />
    </PageLayout>
  )
}
