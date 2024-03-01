import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useGetConsensusAccountsAddressDebondingDelegationsTo } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as limit } from '../../config'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { CardEmptyState } from '../../components/CardEmptyState'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { DebondingDelegations } from '../../components/Delegations'
import { ValidatorDetailsContext } from './hooks'

export const validatorDebondingContainerId = 'debonding'

export const DebondingDelegationsCard: FC<ValidatorDetailsContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <LinkableDiv id={validatorDebondingContainerId}>
        <CardHeader disableTypography component="h3" title={t('validator.undelegations')} />
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>
          <DebondingDelegationsView scope={scope} address={address} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}

const DebondingDelegationsView: FC<ValidatorDetailsContext> = ({ scope, address }) => {
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
    <>
      {isFetched && !debondingDelegations?.length && (
        <CardEmptyState label={t('validator.emptyDebondingList')} />
      )}
      <DebondingDelegations
        debondingDelegations={debondingDelegations}
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
