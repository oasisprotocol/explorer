import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { useGetConsensusBlocks } from '../../../oasis-nexus/api'
import { ConsensusBlocks } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const LatestConsensusBlocksContent: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { isMobile } = useScreenSize()
  const { network } = scope
  const blocksQuery = useGetConsensusBlocks(
    network,
    { limit },
    {
      query: {
        cacheTime: 0,
      },
    },
  )
  return (
    <ConsensusBlocks
      isLoading={blocksQuery.isLoading}
      blocks={blocksQuery.data?.data.blocks}
      limit={limit}
      pagination={false}
      showHash={!isMobile}
    />
  )
}

export const LatestConsensusBlocks: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        disableTypography
        component="h3"
        title={t('blocks.latest')}
        action={
          <Link
            component={RouterLink}
            to={RouteUtils.getLatestBlocksRoute(scope)}
            sx={{ color: COLORS.brandDark }}
          >
            {t('common.viewAll')}
          </Link>
        }
      />

      <CardContent>
        <ErrorBoundary light={true}>
          <LatestConsensusBlocksContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
