import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { AddressSwitchOption } from '../../components/AddressSwitch'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
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
    <Card>
      <LinkableDiv id={eventsContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.events')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
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
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
