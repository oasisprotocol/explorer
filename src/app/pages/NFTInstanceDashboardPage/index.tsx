import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { InstanceTitleCard } from './InstanceTitleCard'
import { InstanceDetailsCard } from './InstanceDetailsCard'
import { InstanceImageCard } from './InstanceImageCard'
import { Layer, Runtime, useGetRuntimeEvmTokensAddressNftsId } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'

export const NFTInstanceDashboardPage: FC = () => {
  const scope = useRequiredScopeParam()
  const { address, instanceId } = useParams()
  if (scope.layer === Layer.consensus) {
    // There can be no ERC-20 or ERC-721 tokens on consensus
    throw AppErrors.UnsupportedLayer
  }

  if (!address || !instanceId) {
    throw AppErrors.InvalidUrl
  }

  const { data, isFetched, isLoading } = useGetRuntimeEvmTokensAddressNftsId(
    scope.network,
    scope.layer as Runtime,
    address,
    instanceId,
  )
  const nft = data?.data

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
    </PageLayout>
  )
}
