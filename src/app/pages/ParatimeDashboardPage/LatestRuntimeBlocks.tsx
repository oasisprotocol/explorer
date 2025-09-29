import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useGetRuntimeBlocks } from '../../../oasis-nexus/api'
import { RuntimeBlocks, BlocksTableType } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { RouteUtils } from '../../utils/route-utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { RuntimeScope } from '../../../types/searchScope'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

const LatestRuntimeBlocksContent: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { isMobile } = useScreenSize()
  const { network, layer } = scope
  const blocksQuery = useGetRuntimeBlocks(
    network,
    layer,
    { limit },
    {
      query: {
        cacheTime: 0,
      },
    },
  )

  return (
    <RuntimeBlocks
      isLoading={blocksQuery.isLoading}
      blocks={blocksQuery.data?.data.blocks}
      limit={limit}
      pagination={false}
      type={isMobile ? BlocksTableType.Mobile : BlocksTableType.DesktopLite}
    />
  )
}

export const LatestRuntimeBlocks: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ width: '100%' }}>
      <div className="flex justify-between items-center mb-4 pr-4 sm:pr-0">
        <Typography variant="h3">{t('blocks.latest')}</Typography>
        <Link asChild className="font-medium px-4" textColor="primary">
          <RouterLink to={RouteUtils.getLatestBlocksRoute(scope)}>{t('common.viewAll')}</RouterLink>
        </Link>
      </div>
      <CardContent>
        <ErrorBoundary light minHeight={400}>
          <LatestRuntimeBlocksContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
