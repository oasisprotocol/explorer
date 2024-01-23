import { FC } from 'react'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { SubPageCard } from 'app/components/SubPageCard'
import { useTranslation } from 'react-i18next'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { SearchScope } from '../../../types/searchScope'
import { AddressSwitchOption } from '../../components/AddressSwitch'

type AccountEventProps = {
  scope: SearchScope
  isLoading: boolean
  isError: boolean
  events: RuntimeEvent[] | undefined
}

export const AccountEventsCard: FC<AccountEventProps> = ({ scope, isLoading, isError, events }) => {
  const { t } = useTranslation()

  return (
    <SubPageCard title={t('common.events')}>
      <RuntimeEventsDetailedList
        scope={scope}
        events={events}
        isLoading={isLoading}
        isError={isError}
        addressSwitchOption={AddressSwitchOption.ETH} // TODO
      />
    </SubPageCard>
  )
}
