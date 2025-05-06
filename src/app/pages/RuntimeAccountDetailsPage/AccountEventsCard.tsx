import { FC } from 'react'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { useAccountEvents } from './hook'
import { RuntimeAccountDetailsContext } from '.'
import { eventsContainerId } from '../../utils/tabAnchors'

export const AccountEventsCard: FC<RuntimeAccountDetailsContext> = ({ scope, address }) => {
  const { isLoading, isError, events, pagination, totalCount, isTotalCountClipped } = useAccountEvents(
    scope,
    address,
  )

  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
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
      />
    </LinkableCardLayout>
  )
}
