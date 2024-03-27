import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import {
  DebondingDelegation,
  useGetConsensusAccountsAddressDebondingDelegationsTo,
} from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { ValidatorDetailsContext } from './hooks'
import { debondingContainerId } from './tabAnchors'
import { SimplePaginationEngine } from 'app/components/Table/PaginationEngine'

export const DebondingDelegationsCard: FC<ValidatorDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
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
    <Card>
      <LinkableDiv id={debondingContainerId}>
        <CardHeader disableTypography component="h3" title={t('validator.undelegations')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
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
        </ErrorBoundary>
      </CardContent>
    </Card>
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
