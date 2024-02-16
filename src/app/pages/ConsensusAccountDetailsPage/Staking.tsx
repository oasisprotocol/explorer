import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import { COLORS } from '../../../styles/theme/colors'
import { Account, useGetConsensusAccountsAddressDelegations } from '../../../oasis-nexus/api'
import { useRequiredScopeParam } from '../../../app/hooks/useScopeParam'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_DASHBOARD as PAGE_SIZE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { Delegations } from '../..//components/Delegations'
import { docs, wallet } from '../../utils/externalLinks'

type StakingProps = {
  account: Account | undefined
  isLoading: boolean
}

export const Staking: FC<StakingProps> = ({ account, isLoading }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        action={
          <Link
            href={docs.consensusStaking}
            rel="noopener noreferrer"
            target="_blank"
            sx={{ color: COLORS.brandDark }}
          >
            {t('validator.sharesDocs')}
          </Link>
        }
        disableTypography
        component="h3"
        title={t('common.staking')}
      />
      <CardContent>
        {isLoading && <Skeleton variant="rectangular" height={300} />}
        {account && <StakingContent address={account?.address} />}
      </CardContent>
    </Card>
  )
}

type StakingContentProps = {
  address: string
}

const StakingContent: FC<StakingContentProps> = ({ address }) => {
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const { network } = scope
  const delegationsQuery = useGetConsensusAccountsAddressDelegations(
    network,
    address,
    {},
    {
      query: {
        cacheTime: 0,
      },
    },
  )
  const { isLoading, isFetched, data } = delegationsQuery
  if (isFetched && offset && !delegationsQuery.data?.data?.delegations?.length) {
    throw AppErrors.PageDoesNotExist
  }

  if (isFetched && !delegationsQuery.data?.data.delegations.length) {
    return <StakingEmptyState />
  }

  return (
    <>
      {isFetched && (
        <Delegations
          delegations={delegationsQuery.data?.data.delegations}
          isLoading={isLoading}
          limit={PAGE_SIZE}
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

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(3),
  },
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(6),
  },
}))

const StakingEmptyState: FC = () => {
  const { t } = useTranslation()

  return (
    <StyledBox gap={3}>
      <StackedBarChartIcon sx={{ color: COLORS.grayMedium, fontSize: 40, opacity: 0.5 }} />
      <Typography
        sx={{
          color: COLORS.grayMedium,
          fontWeight: 700,
          maxWidth: '160px',
          textAlign: 'center',
          opacity: 0.5,
        }}
      >
        {t('account.notStaking')}
      </Typography>
      <Link href={wallet.homepage} rel="noopener noreferrer" target="_blank">
        {t('account.startStaking')}
      </Link>
    </StyledBox>
  )
}
