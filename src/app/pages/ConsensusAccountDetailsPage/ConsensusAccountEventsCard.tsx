import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetConsensusEvents } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { ConsensusEventsList } from '../../components/ConsensusEvents/ConsensusEventsList'
import { ConsensusAccountDetailsContext } from './hooks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { LinkableCardLayout } from '../../components/LinkableCardLayout'
import { useSearchParamsPagination } from '../..//components/Table/useSearchParamsPagination'
import { eventsContainerId } from '../../utils/tabAnchors'
import { CardEmptyState } from 'app/components/CardEmptyState'

const ConsensusAccountEventsList: FC<ConsensusAccountDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const eventsQuery = useGetConsensusEvents(scope.network, {
    rel: address,
    limit,
    offset,
  })
  const { isFetched, isLoading, data, isError } = eventsQuery
  const events = data?.data.events
  if (isFetched && pagination.selectedPage > 1 && !events?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (!events?.length && isFetched) {
    return <CardEmptyState label={t('event.cantFindMatchingEvents')} />
  }

  return (
    <ConsensusEventsList
      scope={scope}
      events={events}
      isLoading={isLoading}
      isError={isError}
      pagination={{
        selectedPage: pagination.selectedPage,
        linkToPage: pagination.linkToPage,
        totalCount: data?.data.total_count,
        isTotalCountClipped: data?.data.is_total_count_clipped,
        rowsPerPage: limit,
      }}
      showTxHash
    />
  )
}

export const ConsensusAccountEventsCard: FC<ConsensusAccountDetailsContext> = context => {
  return (
    <LinkableCardLayout containerId={eventsContainerId} title="">
      <ConsensusAccountEventsList {...context} />
    </LinkableCardLayout>
  )
}
