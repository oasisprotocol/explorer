import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import {
  Account,
  useGetConsensusAccountsAddressDebondingDelegations,
  useGetConsensusAccountsAddressDelegations,
} from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../../app/hooks/useScopeParam'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../..//components/Delegations'
import { wallet } from '../../utils/externalLinks'
import { t } from 'i18next'
import { ConsensusAccountCardEmptyState } from './ConsensusAccountCardEmptyState'

export const StyledCard = styled(Card)(({ theme }) => ({
  flex: 1,
  '&': {
    padding: `0 ${theme.spacing(4)}`,
    marginBottom: 0,
  },
}))

type StakingProps = {
  account: Account | undefined
  isLoading: boolean
}

export const Staking: FC<StakingProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()
  const [tab, setTabValue] = useState(0)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs value={tab} onChange={(event, tab) => setTabValue(tab)} aria-label={t('validator.delegations')}>
        <Tab label={t('common.staked')} />
        <Tab label={t('common.debonding')} />
      </Tabs>
      <StyledCard>
        <CardContent>
          {isLoading && <Skeleton variant="rectangular" height={300} sx={{ marginTop: 5 }} />}
          {account && tab === 0 && <ActiveDelegations address={account?.address} />}
          {account && tab === 1 && <DebondingDelegations address={account?.address} />}
        </CardContent>
      </StyledCard>
    </Box>
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
            compact: true,
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
            compact: true,
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
