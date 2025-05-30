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

export const RuntimeEventsDetailedList: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
  isError: boolean
  pagination: false | TablePaginationProps
  showTxHash: boolean
}> = ({ scope, events, isLoading, isError, pagination, showTxHash }) => {
  const { t } = useTranslation()

  if (isError) {
    return <CardEmptyState label={t('event.cantLoadEvents')} />
  }

  if (isLoading) {
    return <TextSkeleton numberOfRows={10} />
  }

  if (!events?.length) {
    return <CardEmptyState label={t('event.cantFindMatchingEvents')} />
  }

  return (
    <>
      {events &&
        events.map((event, index) => (
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
