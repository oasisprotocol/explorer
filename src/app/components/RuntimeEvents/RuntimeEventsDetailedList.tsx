import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { AddressSwitchOption } from '../AddressSwitch'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../../pages/AccountDetailsPage/CardEmptyState'
import { TextSkeleton } from '../Skeleton'
import { RuntimeEventDetails } from './RuntimeEventDetails'
import Divider from '@mui/material/Divider'

const RuntimeEventDetailsWithSeparator: FC<{
  scope: SearchScope
  event: RuntimeEvent
  isFirst: boolean
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, event, isFirst, addressSwitchOption }) => {
  return (
    <>
      {!isFirst && <Divider variant="card" />}
      <RuntimeEventDetails scope={scope} event={event} addressSwitchOption={addressSwitchOption} />
    </>
  )
}

export const RuntimeEventsDetailedList: FC<{
  scope: SearchScope
  events: RuntimeEvent[] | undefined
  isLoading: boolean
  isError: boolean
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, events, isLoading, isError, addressSwitchOption }) => {
  const { t } = useTranslation()
  return (
    <>
      {isError && <CardEmptyState label={t('runtimeEvent.cantLoadEvents')} />}
      {isLoading && <TextSkeleton numberOfRows={10} />}
      {events &&
        events.map((event, index) => (
          <RuntimeEventDetailsWithSeparator
            key={`event-${index}`}
            scope={scope}
            isFirst={!index}
            event={event}
            addressSwitchOption={addressSwitchOption}
          />
        ))}
    </>
  )
}
