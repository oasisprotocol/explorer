import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { useGetConsensusBlocks } from '../../../oasis-nexus/api'
import { ConsensusBlocks } from '../../components/Blocks/ConsensusBlocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { ConsensusScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const LatestConsensusBlocksContent: FC<{ scope: ConsensusScope }> = ({ scope }) => {
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

export const LatestConsensusBlocks: FC<{ scope: ConsensusScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('blocks.latest')}</Typography>
          <Link asChild className="font-medium px-4" textColor="primary">
            <RouterLink to={RouteUtils.getLatestBlocksRoute(scope)}>{t('common.viewAll')}</RouterLink>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary light={true}>
          <LatestConsensusBlocksContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
