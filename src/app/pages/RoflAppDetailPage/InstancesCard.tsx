import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, useGetRuntimeRoflAppsIdInstances } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { instancesContainerId } from '../../utils/tabAnchors'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { CardEmptyState } from '../../components/CardEmptyState'
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
  const { t } = useTranslation()
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const instancesQuery = useGetRuntimeRoflAppsIdInstances(network, Layer.sapphire, id, {
    limit,
    offset,
  })
  const { isFetched, isLoading, data } = instancesQuery
  const instances = data?.data.instances

  return (
    <>
      {isFetched && !instances?.length && <CardEmptyState label={t('rofl.emptyInstancesList')} />}
      <InstancesList
        instances={instances}
        isLoading={isLoading}
        limit={limit}
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount: data?.data.total_count,
          isTotalCountClipped: data?.data.is_total_count_clipped,
          rowsPerPage: limit,
        }}
      />
    </>
  )
}
