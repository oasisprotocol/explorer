import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { EmptyState } from '../../components/EmptyState'
import { RuntimeBlockDetailsContext } from '.'
import { eventsContainerId } from '../../utils/tabAnchors'

const EventsList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (scope.layer === Layer.consensus) {
    // Loading events for consensus blocks is not yet supported.
    // Should use useGetConsensusEvents()
    throw AppErrors.UnsupportedLayer
  }
  const eventsQuery = useGetRuntimeEvents(scope.network, scope.layer, {
    block: blockHeight,
    // TODO: search for tx_hash = null
    limit,
    offset,
  })

  const { isLoading, isError, data } = eventsQuery

  const events = data?.data.events

  if (!events?.length && !isLoading) {
    return (
      <EmptyState description={t('event.cantFindMatchingEvents')} title={t('event.noEvents')} light={true} />
    )
  }

  return (
    <RuntimeEventsDetailedList
      scope={scope}
      events={events}
      isLoading={isLoading}
      isError={isError}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
      showTxHash
    />
  )
}

export const RuntimeBlockEventsCard: FC<RuntimeBlockDetailsContext> = props => {
  if (!props.blockHeight) {
    return null
  }

  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <EventsList {...props} />
    </LinkableCardLayout>
  )
}
