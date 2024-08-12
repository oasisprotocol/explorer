import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { AddressSwitchOption } from '../../components/AddressSwitch'
import { useAccountEvents } from './hook'
import { RuntimeAccountDetailsContext } from '.'

export const eventsContainerId = 'events'

export const AccountEventsCard: FC<RuntimeAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isLoading, isError, events, pagination, totalCount, isTotalCountClipped } = useAccountEvents(
    scope,
    address,
  )

  return (
    <LinkableCardLayout containerId={eventsContainerId} title={t('common.events')}>
      <RuntimeEventsDetailedList
        scope={scope}
        events={events}
        isLoading={isLoading}
        isError={isError}
        addressSwitchOption={AddressSwitchOption.ETH} // TODO
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount,
          isTotalCountClipped,
          rowsPerPage: limit,
        }}
      />
    </LinkableCardLayout>
  )
}
