import { FC } from 'react'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { useAccountEvents } from './hook'
import { RuntimeAccountDetailsContext } from '.'
import { eventsContainerId } from '../../utils/tabAnchors'
import { RuntimeEventTypeFilter } from '../../components/RuntimeEvents/RuntimeEventTypeFilter'
import Divider from '@mui/material/Divider'

export const AccountEventsCard: FC<RuntimeAccountDetailsContext> = ({
  scope,
  address,
  eventType,
  setEventType,
}) => {
  const { isLoading, isError, events, pagination, totalCount, isTotalCountClipped } = useAccountEvents(
    scope,
    address,
    eventType,
  )

  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <RuntimeEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
      <Divider variant="card" />
      <RuntimeEventsDetailedList
        scope={scope}
        events={events}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount,
          isTotalCountClipped,
          rowsPerPage: limit,
        }}
        showTxHash
        filtered={eventType !== 'any'}
      />
    </LinkableCardLayout>
  )
}
