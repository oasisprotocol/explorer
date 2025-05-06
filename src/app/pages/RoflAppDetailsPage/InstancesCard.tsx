import { FC } from 'react'
import { Layer, useGetConsensusEpochs, useGetRuntimeRoflAppsIdInstances } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { instancesContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { InstancesList } from './InstancesList'
import { RoflAppDetailsContext } from './hooks'

export const InstancesCard: FC<RoflAppDetailsContext> = context => {
  return (
    <LinkableCardLayout containerId={instancesContainerId} title="">
      <InstancesView {...context} />
    </LinkableCardLayout>
  )
}

const InstancesView: FC<RoflAppDetailsContext> = ({ scope, id }) => {
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const instancesQuery = useGetRuntimeRoflAppsIdInstances(network, Layer.sapphire, id, {
    limit,
    offset,
  })
  const { isLoading, data } = instancesQuery
  const instances = data?.data.instances
  const { isLoading: isEpochLoading, data: epochData } = useGetConsensusEpochs(scope.network, { limit: 1 })
  const currentEpoch = epochData?.data.epochs[0].id

  return (
    <InstancesList
      instances={instances}
      currentEpoch={currentEpoch}
      isLoading={isLoading || isEpochLoading}
      limit={limit}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
      appId={id}
      scope={scope}
    />
  )
}
