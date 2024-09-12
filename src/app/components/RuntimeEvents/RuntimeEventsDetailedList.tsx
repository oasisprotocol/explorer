import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { TablePagination, TablePaginationProps } from '../Table/TablePagination'
import { AddressSwitchOption } from '../AddressSwitch'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../CardEmptyState'
import { TextSkeleton } from '../Skeleton'
import { RuntimeEventDetails } from './RuntimeEventDetails'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { isGasFeeEvent } from './isGasFeeEvent'

export const RuntimeEventsDetailedList: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
  isError: boolean
  addressSwitchOption: AddressSwitchOption
  pagination: false | TablePaginationProps
}> = ({ scope, events, isLoading, isError, addressSwitchOption, pagination }) => {
  const { t } = useTranslation()

  const sortedEvents = events?.slice().sort((a, b) => {
    // Attempt to sort gas/fee events to the bottom of a transaction.
    // If events are paginated, it might not be at the end.
    if (a.tx_hash === b.tx_hash) {
      return (isGasFeeEvent(a) ? 1 : 0) - (isGasFeeEvent(b) ? 1 : 0)
    }
    return 0
  })

  return (
    <>
      {isError && <CardEmptyState label={t('runtimeEvent.cantLoadEvents')} />}
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {sortedEvents &&
        sortedEvents.map((event, index) => (
          <div key={`event-${index}`} style={isGasFeeEvent(event) ? { opacity: 0.5 } : {}}>
            {index > 0 && <Divider variant="card" />}
            <RuntimeEventDetails scope={scope} event={event} addressSwitchOption={addressSwitchOption} />
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
