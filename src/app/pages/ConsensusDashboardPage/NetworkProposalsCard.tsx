import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { useGetConsensusProposals } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import { NetworkProposalsList } from '../../components/NetworkProposalsList'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const NetworkProposalsCard: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope
  const proposalsQuery = useGetConsensusProposals(network, { limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('networkProposal.listTitle')}
        action={
          <Link
            component={RouterLink}
            // TODO: Update when Proposals page is ready
            to={''}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <NetworkProposalsList
          proposals={proposalsQuery.data?.data.proposals}
          isLoading={proposalsQuery.isLoading}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
