import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import { Account, useGetConsensusAccountsAddressDelegations } from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../../app/hooks/useScopeParam'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../..//components/Delegations'
import { wallet } from '../../utils/externalLinks'
import { t } from 'i18next'
import { ConsensusAccountCardEmptyState } from './ConsensusAccountCardEmptyState'
import { FilterButtons } from '../../components/FilterButtons'

type StakingProps = {
  account: Account | undefined
  isLoading: boolean
}
type DelegationStatus = 'active' | 'debonding'

export const Staking: FC<StakingProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()
  const [type, setType] = useState('active')
  const options: { label: string; value: DelegationStatus }[] = [
    {
      label: t('account.active'),
      value: 'active',
    },
    {
      label: t('account.debonding'),
      value: 'debonding',
    },
  ]

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={<FilterButtons options={options} value={type} onSelect={type => setType(type)} />}
        disableTypography
        component="h3"
        title={t('common.staking')}
      />
      <CardContent>
        {isLoading && <Skeleton variant="rectangular" height={300} />}
        {account && type === 'active' && <ActiveDelegations address={account?.address} />}
        {account && type === 'debonding' && <DebondingDelegations address={account?.address} />}
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
  return null
}
