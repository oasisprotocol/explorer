import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetConsensusProposals } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { ConsensusScope } from '../../../types/searchScope'
import { NetworkProposalsList } from '../../components/NetworkProposalsList'
import { RouteUtils } from 'app/utils/route-utils'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const NetworkProposalsCardContent: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { network } = scope
  const proposalsQuery = useGetConsensusProposals(network, { limit })

  return (
    <NetworkProposalsList
      proposals={proposalsQuery.data?.data.proposals}
      isLoading={proposalsQuery.isLoading}
      limit={limit}
      pagination={false}
    />
  )
}

export const NetworkProposalsCard: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <Typography variant="h3">{t('networkProposal.listTitle')}</Typography>
        <Link asChild className="font-medium px-4" textColor="primary">
          <RouterLink to={RouteUtils.getProposalsRoute(network)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>
      <CardContent>
        <ErrorBoundary light={true}>
          <NetworkProposalsCardContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
