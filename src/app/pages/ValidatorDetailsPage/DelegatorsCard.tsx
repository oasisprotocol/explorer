import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useGetConsensusAccountsAddressDelegationsTo } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { ValidatorDetailsContext } from './hooks'

export const validatorDelegatorsContainerId = 'delegators'

export const DelegatorsCard: FC<ValidatorDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={validatorDelegatorsContainerId}>
        <CardHeader disableTypography component="h3" title={t('validator.delegators')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <DelegatorsCardView scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const DelegatorsCardView: FC<ValidatorDetailsContext> = ({ scope, address }) => {
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
    <>
      {isFetched && !delegations?.length && <CardEmptyState label={t('validator.emptyDelegationsList')} />}
      <Delegations
        delegations={delegations}
        isLoading={isLoading}
        limit={limit}
        pagination={{
          selectedPage: pagination.selectedPage,
          linkToPage: pagination.linkToPage,
          totalCount: data?.data.total_count,
          isTotalCountClipped: data?.data.is_total_count_clipped,
          rowsPerPage: limit,
        }}
      />
    </>
  )
}
