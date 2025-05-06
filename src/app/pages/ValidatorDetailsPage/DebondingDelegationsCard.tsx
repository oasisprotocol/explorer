import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DebondingDelegation,
  useGetConsensusAccountsAddressDebondingDelegationsTo,
} from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../../config'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { ValidatorDetailsContext } from './hooks'
import { debondingContainerId } from '../../utils/tabAnchors'
import { SimplePaginationEngine } from 'app/components/Table/PaginationEngine'
import { LinkableCardLayout } from 'app/components/LinkableCardLayout'

export const DebondingDelegationsCard: FC<ValidatorDetailsContext> = ({ scope, address }) => {
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const debondingQuery = useGetConsensusAccountsAddressDebondingDelegationsTo(network, address, {
    limit,
    offset,
  })
  const { isFetched, isLoading, data } = debondingQuery
  const debondingDelegations = data?.data.debonding_delegations

  return (
    <LinkableCardLayout containerId={debondingContainerId} title="">
      <DebondingDelegationsView
        debondingDelegations={debondingDelegations}
        isFetched={isFetched}
        isLoading={isLoading}
        pagination={{
          ...pagination,
          isTotalCountClipped: data?.data.is_total_count_clipped,
          totalCount: data?.data.total_count,
        }}
      />
    </LinkableCardLayout>
  )
}

type DebondingDelegationsViewProps = {
  debondingDelegations: DebondingDelegation[] | undefined
  isFetched: boolean
  isLoading: boolean
  pagination: SimplePaginationEngine & {
    isTotalCountClipped: boolean | undefined
    totalCount: number | undefined
  }
}

const DebondingDelegationsView: FC<DebondingDelegationsViewProps> = ({
  debondingDelegations,
  isFetched,
  isLoading,
  pagination,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {isFetched && !debondingDelegations?.length && (
        <CardEmptyState label={t('validator.emptyDebondingList')} />
      )}
      <Delegations
        debonding
        delegations={debondingDelegations}
        isLoading={isLoading}
        limit={limit}
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount: pagination.totalCount,
          isTotalCountClipped: pagination.isTotalCountClipped,
          rowsPerPage: limit,
        }}
      />
    </>
  )
}
