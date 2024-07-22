import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Layer, useGetRuntimeEvents } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { AppErrors } from '../../../types/errors'
import { RuntimeEventsDetailedList } from '../../components/RuntimeEvents/RuntimeEventsDetailedList'
import { AddressSwitchOption } from '../../components/AddressSwitch'
import { EmptyState } from '../../components/EmptyState'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { RuntimeBlockDetailsContext } from '.'

export const eventsContainerId = 'events'

const EventsList: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  if (scope.layer === Layer.consensus) {
    // Loading events for consensus blocks is not yet supported.
    // Should use useGetConsensusEvents()
    throw AppErrors.UnsupportedLayer
  }
  const eventsQuery = useGetRuntimeEvents(scope.network, scope.layer, {
    block: blockHeight,
    // TODO: search for tx_hash = null
    limit,
    offset,
  })

  const { isLoading, isError, data } = eventsQuery

  const events = data?.data.events

  if (!events?.length && !isLoading) {
    return (
      <EmptyState
        description={t('runtimeEvent.cantFindMatchingEvents')}
        title={t('runtimeEvent.noEvents')}
        light={true}
      />
    )
  }

  return (
    <RuntimeEventsDetailedList
      scope={scope}
      events={events}
      isLoading={isLoading}
      isError={isError}
      addressSwitchOption={AddressSwitchOption.ETH}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
    />
  )
}

export const BlockEventsCard: FC<RuntimeBlockDetailsContext> = ({ scope, blockHeight }) => {
  const { t } = useTranslation()

  if (!blockHeight) {
    return null
  }

  return (
    <Card>
      <LinkableDiv id={eventsContainerId}>
        <CardHeader disableTypography component="h3" title={t('common.events')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <EventsList scope={scope} blockHeight={blockHeight} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
