import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { SearchScope } from '../../../types/searchScope'
import { ConsensusEvent } from '../../../oasis-nexus/api'
import { TablePagination, TablePaginationProps } from '../Table/TablePagination'
import { CardEmptyState } from '../CardEmptyState'
import { TextSkeleton } from '../Skeleton'
import { ConsensusEventDetails } from './ConsensusEventDetails'

export const ConsensusEventsList: FC<{
  scope: SearchScope
  events: ConsensusEvent[] | undefined
  isLoading: boolean
  isError: boolean
  pagination: false | TablePaginationProps
  showTxHash: boolean
}> = ({ scope, events, isLoading, isError, pagination, showTxHash }) => {
  const { t } = useTranslation()
  return (
    <>
      {isError && <CardEmptyState label={t('event.cantLoadEvents')} />}
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {events &&
        events.map((event, index) => (
          <div key={`event-${index}`}>
            {index > 0 && <Divider variant="card" />}
            <ConsensusEventDetails scope={scope} event={event} showTxHash={showTxHash} />
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
