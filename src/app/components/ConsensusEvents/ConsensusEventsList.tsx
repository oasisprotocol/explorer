import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { ConsensusScope } from '../../../types/searchScope'
import { ConsensusEvent } from '../../../oasis-nexus/api'
import { TablePagination, TablePaginationProps } from '../Table/TablePagination'
import { CardEmptyState } from '../CardEmptyState'
import { TextSkeleton } from '../Skeleton'
import { ConsensusEventDetails } from './ConsensusEventDetails'
import { AppErrors } from '../../../types/errors'
import { EmptyState } from '../EmptyState'
import { CardDivider } from '../../components/Divider'

export const ConsensusEventsList: FC<{
  scope: ConsensusScope
  events: ConsensusEvent[] | undefined
  isLoading: boolean
  isError: boolean
  pagination: false | TablePaginationProps
  showTxHash: boolean
  filtered: boolean
}> = ({ scope, events, isLoading, isError, pagination, showTxHash, filtered }) => {
  const { t } = useTranslation()
  if (isLoading) {
    // Still loading?
    return <TextSkeleton numberOfRows={10} />
  } else if (isError) {
    // Have we failed?
    return <CardEmptyState label={t('event.cantLoadEvents')} />
  } else if (!events || !events?.length) {
    // No data. Let's see why
    if (!!pagination && pagination.selectedPage > 1) {
      // Wrong page?
      throw AppErrors.PageDoesNotExist
    } else if (filtered) {
      // Is it because of filters?
      return <CardEmptyState label={t('tableSearch.noMatchingResults')} />
    } else {
      // There is no particular reason, we just don't have data
      return (
        <EmptyState
          description={t('event.cantFindMatchingEvents')}
          title={t('event.noEvents')}
          light={true}
        />
      )
    }
  } else {
    return (
      <>
        {events.map((event, index) => (
          <div key={`event-${index}`}>
            {index > 0 && <CardDivider />}
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
}
