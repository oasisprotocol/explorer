import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { TablePagination, TablePaginationProps } from '../Table/TablePagination'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../CardEmptyState'
import { TextSkeleton } from '../Skeleton'
import { RuntimeEventDetails } from './RuntimeEventDetails'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { AppErrors } from '../../../types/errors'
import { EmptyState } from '../EmptyState'

export const RuntimeEventsDetailedList: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
  isError: boolean
  pagination: false | TablePaginationProps
  showTxHash: boolean
  filtered: boolean
}> = ({ scope, events, isLoading, isError, pagination, showTxHash, filtered }) => {
  const { t } = useTranslation()
  if (isLoading) {
    // Are we still loading?
    return <TextSkeleton numberOfRows={10} />
  } else if (isError) {
    // Have we failed to load?
    return <CardEmptyState label={t('event.cantLoadEvents')} />
  } else if (!events || !events.length) {
    // Apparently there is no data. Let's see why!
    if (pagination && pagination.selectedPage > 1) {
      // Are we on the wrong page?
      throw AppErrors.PageDoesNotExist
    } else if (filtered) {
      // Maybe it's because of filters?
      return <CardEmptyState label={t('tableSearch.noMatchingResults')} />
    } else {
      // There is no special reason, there is just no data
      return (
        <EmptyState
          description={t('event.cantFindMatchingEvents')}
          title={t('event.noEvents')}
          light={true}
        />
      )
    }
  } else {
    // We have data. Show it normally.
    return (
      <>
        {events.map((event, index) => (
          <div key={`event-${index}`}>
            {index > 0 && <Divider variant="card" />}
            <RuntimeEventDetails scope={scope} event={event} showTxHash={showTxHash} />
          </div>
        ))}
        {pagination && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TablePagination {...pagination} />
          </Box>
        )}
      </>
    )
  }
}
