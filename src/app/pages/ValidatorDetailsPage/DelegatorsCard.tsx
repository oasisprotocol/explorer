import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Delegation, useGetConsensusAccountsAddressDelegationsTo } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { ValidatorDetailsContext } from './hooks'
import { delegatorsContainerId } from './tabAnchors'
import { SimplePaginationEngine } from 'app/components/Table/PaginationEngine'

export const DelegatorsCard: FC<ValidatorDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { network } = scope
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const delegationsQuery = useGetConsensusAccountsAddressDelegationsTo(network, address, {
    limit,
    offset,
  })
  const { isFetched, isLoading, data } = delegationsQuery
  const delegations = data?.data.delegations

  return (
    <Card>
      <LinkableDiv id={delegatorsContainerId}>
        <CardHeader disableTypography component="h3" title={t('validator.delegators')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <DelegatorsCardView
            delegations={delegations}
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

type DelegatorsViewProps = {
  delegations: Delegation[] | undefined
  isFetched: boolean
  isLoading: boolean
  pagination: SimplePaginationEngine & {
    isTotalCountClipped: boolean | undefined
    totalCount: number | undefined
  }
}

const DelegatorsCardView: FC<DelegatorsViewProps> = ({ delegations, isFetched, isLoading, pagination }) => {
  const { t } = useTranslation()

  return (
    <>
      {isFetched && !delegations?.length && <CardEmptyState label={t('validator.emptyDelegationsList')} />}
      <Delegations
        delegations={delegations}
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
