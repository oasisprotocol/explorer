import { FC } from 'react'
import { useGetConsensusEvents } from '../../../oasis-nexus/api'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusAccountDetailsContext } from './hooks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { eventsContainerId } from '../../utils/tabAnchors'
import { ConsensusEventTypeFilter } from '../../components/ConsensusEvents/ConsensusEventTypeFilter'
import { getConsensusEventTypeFilteringParam } from '../../hooks/useCommonParams'
import Divider from '@mui/material/Divider'

const ConsensusAccountEventsList: FC<ConsensusAccountDetailsContext> = ({ scope, address, eventType }) => {
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetConsensusEvents(scope.network, {
    rel: address,
    limit,
    offset,
    ...getConsensusEventTypeFilteringParam(eventType),
  })
  const { isLoading, data, isError } = eventsQuery
  const events = data?.data.events

  return (
    <ConsensusEventsList
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

export const ConsensusAccountEventsCard: FC<ConsensusAccountDetailsContext> = context => {
  const { scope, eventType, setEventType } = context
  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <ConsensusEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
      <Divider variant={'card'} />
      <ConsensusAccountEventsList {...context} />
    </LinkableCardLayout>
  )
}
