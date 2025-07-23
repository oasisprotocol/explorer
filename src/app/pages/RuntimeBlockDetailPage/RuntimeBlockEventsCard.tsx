import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { RuntimeBlockDetailsContext } from '.'
import { eventsContainerId } from '../../utils/tabAnchors'
import { CardEmptyState } from 'app/components/CardEmptyState'

const EventsList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetRuntimeEvents(scope.network, scope.layer, {
    block: blockHeight,
    // TODO: search for tx_hash = null
    limit,
    offset,
  })

  const { isLoading, isError, data } = eventsQuery

  const events = data?.data.events

  if (!events?.length && !isLoading) {
    return <CardEmptyState label={t('event.cantFindMatchingEvents')} />
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
