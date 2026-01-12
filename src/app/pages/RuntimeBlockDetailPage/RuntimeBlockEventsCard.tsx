import { FC } from 'react'
import { useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { RuntimeBlockDetailsContext } from './types'
import { eventsContainerId } from '../../utils/tabAnchors'
import { getRuntimeEventTypeFilteringParam } from '../../hooks/useCommonParams'
import { RuntimeEventTypeFilter } from '../../components/RuntimeEvents/RuntimeEventTypeFilter'
import { CardDivider } from '../../components/Divider'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const EventsList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight, eventType }) => {
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetRuntimeEvents(scope.network, scope.layer, {
    block: blockHeight,
    // TODO: search for tx_hash = null
    limit,
    offset,
    ...getRuntimeEventTypeFilteringParam(eventType),
  })

  const { isLoading, isError, data } = eventsQuery
  const events = data?.data.events

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
      filtered={eventType !== 'any'}
    />
  )
}

export const RuntimeBlockEventsCard: FC<RuntimeBlockDetailsContext> = props => {
  const { scope, blockHeight, eventType, setEventType } = props
  if (!blockHeight) {
    return null
  }

  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <RuntimeEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
      <CardDivider />
      <ErrorBoundary light>
        <EventsList {...props} />
      </ErrorBoundary>
    </LinkableCardLayout>
  )
}
