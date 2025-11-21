import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@oasisprotocol/ui-library/src/components/tabs'
import {
  Runtime,
  RuntimeAccount,
  useGetRuntimeAccountsAddressDebondingDelegations,
  useGetRuntimeAccountsAddressDelegations,
} from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../../app/hooks/useScopeParam'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { dapps } from '../../utils/externalLinks'
import { t } from 'i18next'
import { AccountCardEmptyState } from './AccountCardEmptyState'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type StakingProps = {
  account: RuntimeAccount | undefined
  isLoading: boolean
}

export const Staking: FC<StakingProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('stakingOverview')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="staked" aria-label={t('validator.delegations')}>
          <TabsList variant="layout" className="md:max-w-[400px] rounded-b-md mb-2">
            <TabsTrigger value="staked">{t('common.staked')}</TabsTrigger>
            <TabsTrigger value="debonding">{t('common.debonding')}</TabsTrigger>
          </TabsList>
          {isLoading && <Skeleton className="h-[200px] mt-8" />}
          {!isLoading && account && (
            <>
              <TabsContent value="staked" className="min-h-28">
                <ActiveDelegations address={account?.address} />
              </TabsContent>
              <TabsContent value="debonding" className="min-h-28">
                <DebondingDelegations address={account?.address} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

type DelegationCardProps = {
  address: string
}

const ActiveDelegations: FC<DelegationCardProps> = ({ address }) => {
  const pagination = useSearchParamsPagination('activeDelegations')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const { network } = scope
  const delegationsQuery = useGetRuntimeAccountsAddressDelegations(network, scope.layer as Runtime, address, {
    limit: PAGE_SIZE,
    offset,
  })
  const { isLoading, isFetched, data } = delegationsQuery
  if (isFetched && offset && !delegationsQuery.data?.data?.delegations?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (isFetched && !delegationsQuery.data?.data.delegations.length) {
    return (
      <AccountCardEmptyState label={t('account.notStaking')}>
        <Link className="font-semibold" href={dapps.stake} rel="noopener noreferrer" target="_blank">
          {t('account.startStaking')}
        </Link>
      </AccountCardEmptyState>
    )
  }

  return (
    <>
      {isFetched && (
        <Delegations
          delegations={delegationsQuery.data?.data.delegations}
          isLoading={isLoading}
          limit={PAGE_SIZE}
          linkType="validator"
          pagination={{
            className: 'mt-2',
            selectedPage: pagination.selectedPage,
            linkToPage: pagination.linkToPage,
            totalCount: data?.data.total_count,
            isTotalCountClipped: data?.data.is_total_count_clipped,
            rowsPerPage: PAGE_SIZE,
          }}
        />
      )}
    </>
  )
}

const DebondingDelegations: FC<DelegationCardProps> = ({ address }) => {
  const pagination = useSearchParamsPagination('debondingDelegations')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const { network } = scope
  const delegationsQuery = useGetRuntimeAccountsAddressDebondingDelegations(
    network,
    scope.layer as Runtime,
    address,
    {
      limit: PAGE_SIZE,
      offset,
    },
  )
  const { isLoading, isFetched, data } = delegationsQuery
  if (isFetched && offset && !delegationsQuery.data?.data?.debonding_delegations?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (isFetched && !delegationsQuery.data?.data.debonding_delegations.length) {
    return <AccountCardEmptyState label={t('account.notDebonding')} />
  }

  return (
    <>
      {isFetched && (
        <Delegations
          debonding
          delegations={delegationsQuery.data?.data.debonding_delegations}
          isLoading={isLoading}
          limit={PAGE_SIZE}
          linkType="validator"
          pagination={{
            className: 'mt-2',
            selectedPage: pagination.selectedPage,
            linkToPage: pagination.linkToPage,
            totalCount: data?.data.total_count,
            isTotalCountClipped: data?.data.is_total_count_clipped,
            rowsPerPage: PAGE_SIZE,
          }}
        />
      )}
    </>
  )
}
