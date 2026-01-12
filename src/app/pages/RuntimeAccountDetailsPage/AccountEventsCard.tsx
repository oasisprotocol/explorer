import { FC } from 'react'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { useAccountEvents } from './hooks'
import { RuntimeAccountDetailsContext } from './types'
import { eventsContainerId } from '../../utils/tabAnchors'
import { RuntimeEventTypeFilter } from '../../components/RuntimeEvents/RuntimeEventTypeFilter'
import { CardDivider } from '../../components/Divider'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const AccountEventsCardContent: FC<RuntimeAccountDetailsContext> = props => {
  const { scope, address, eventType } = props
  const { isLoading, isError, events, pagination, totalCount, isTotalCountClipped } = useAccountEvents(
    scope,
    address,
    eventType,
  )
  return (
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
  )
}

export const AccountEventsCard: FC<RuntimeAccountDetailsContext> = props => {
  const { scope, eventType, setEventType } = props
  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <RuntimeEventTypeFilter layer={scope.layer} value={eventType} setValue={setEventType} />
      <CardDivider />
      <ErrorBoundary light>
        <AccountEventsCardContent {...props} />
      </ErrorBoundary>
    </LinkableCardLayout>
  )
}
