import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import Link from '@mui/material/Link'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@oasisprotocol/ui-library/src/components/tabs'
import {
  Account,
  useGetConsensusAccountsAddressDebondingDelegations,
  useGetConsensusAccountsAddressDelegations,
} from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../../app/hooks/useScopeParam'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../../components/Delegations'
import { wallet } from '../../utils/externalLinks'
import { t } from 'i18next'
import { ConsensusAccountCardEmptyState } from './ConsensusAccountCardEmptyState'

type StakingProps = {
  account: Account | undefined
  isLoading: boolean
}

export const Staking: FC<StakingProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="staked" className="h-full" aria-label={t('validator.delegations')}>
        <TabsList variant="layout">
          <TabsTrigger value="staked">{t('common.staked')}</TabsTrigger>
          <TabsTrigger value="debonding">{t('common.debonding')}</TabsTrigger>
        </TabsList>
        <Card variant="layout" className="rounded-t-none border-t-0 pt-0 !mb-0">
          <CardContent className="px-4">
            {isLoading && <Skeleton className="h-[300px] mt-8" />}
            {!isLoading && account && (
              <>
                <TabsContent value="staked">
                  <ActiveDelegations address={account?.address} />
                </TabsContent>
                <TabsContent value="debonding">
                  <DebondingDelegations address={account?.address} />
                </TabsContent>
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
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
  const delegationsQuery = useGetConsensusAccountsAddressDelegations(network, address, {
    limit: PAGE_SIZE,
    offset,
  })
  const { isLoading, isFetched, data } = delegationsQuery
  if (isFetched && offset && !delegationsQuery.data?.data?.delegations?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (isFetched && !delegationsQuery.data?.data.delegations.length) {
    return (
      <ConsensusAccountCardEmptyState label={t('account.notStaking')}>
        <Link href={wallet.homepage} rel="noopener noreferrer" target="_blank">
          {t('account.startStaking')}
        </Link>
      </ConsensusAccountCardEmptyState>
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
  const delegationsQuery = useGetConsensusAccountsAddressDebondingDelegations(network, address, {
    limit: PAGE_SIZE,
    offset,
  })
  const { isLoading, isFetched, data } = delegationsQuery
  if (isFetched && offset && !delegationsQuery.data?.data?.debonding_delegations?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (isFetched && !delegationsQuery.data?.data.debonding_delegations.length) {
    return <ConsensusAccountCardEmptyState label={t('account.notDebonding')} />
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
