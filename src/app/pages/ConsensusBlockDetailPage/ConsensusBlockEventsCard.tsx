import { FC } from 'react'
import { useGetConsensusEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusBlockDetailsContext } from './types'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { eventsContainerId } from '../../utils/tabAnchors'
import { getConsensusEventTypeFilteringParam, useConsensusEventTypeParam } from '../../hooks/useCommonParams'
import { ConsensusEventTypeFilter } from '../../components/ConsensusEvents/ConsensusEventTypeFilter'
import { CardDivider } from '../../components/Divider'

const ConsensusBlockEventsList: FC<ConsensusBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { eventType, setEventType } = useConsensusEventTypeParam()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetConsensusEvents(scope.network, {
    block: blockHeight,
    ...getConsensusEventTypeFilteringParam(eventType),
    limit,
    offset,
  })
  const { isLoading, data, isError } = eventsQuery
  const events = data?.data.events

  return (
    <>
      <ConsensusEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
      <CardDivider />
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
    </>
  )
}

export const ConsensusBlockEventsCard: FC<ConsensusBlockDetailsContext> = ({ scope, blockHeight }) => {
  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <ConsensusBlockEventsList scope={scope} blockHeight={blockHeight} />
    </LinkableCardLayout>
  )
}
