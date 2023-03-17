import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import { Layer, useGetRuntimeBlocks } from '../../../oasis-indexer/api'
import { Blocks } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_DASHBOARD } from '../../config'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'

const limit = NUMBER_OF_ITEMS_ON_DASHBOARD

export const LatestBlocks: FC = () => {
  const { t } = useTranslation()
  const layer = useLayerParam()
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus blocks is not yet implemented.
    // We should use useGetConsensusBlocks()
  }
  const blocksQuery = useGetRuntimeBlocks(layer, { limit })

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('blocks.latest')}
        action={
          <Link component={RouterLink} to="blocks" sx={{ color: COLORS.brandExtraDark }}>
            {t('common.viewAll')}
          </Link>
        }
      />
      <CardContent>
        <Blocks
          isLoading={blocksQuery.isLoading}
          blocks={blocksQuery.data?.data.blocks}
          limit={limit}
          pagination={false}
        />
      </CardContent>
    </Card>
  )
}
