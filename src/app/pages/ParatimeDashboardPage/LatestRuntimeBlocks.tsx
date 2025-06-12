import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { useGetRuntimeBlocks } from '../../../oasis-nexus/api'
import { RuntimeBlocks, BlocksTableType } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../../config'
import { COLORS } from '../../../styles/theme/colors'
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
    <Card>
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
        <ErrorBoundary light minHeight={400}>
          <LatestRuntimeBlocksContent scope={scope} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  )
}
