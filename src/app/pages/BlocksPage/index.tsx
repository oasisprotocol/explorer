import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { PageLayout } from '../../components/PageLayout'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { useTranslation } from 'react-i18next'
import CardContent from '@mui/material/CardContent'

import { Blocks } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const BlocksPage: FC = () => {
  const { t } = useTranslation()
  const blocksQuery = useGetEmeraldBlocks(
    {
      limit: PAGE_SIZE,
    },
    { query: { refetchInterval: REFETCH_INTERVAL } },
  )

  return (
    <PageLayout>
      <Card>
        <CardHeader disableTypography component="h3" title={t('blocks.latest')} />
        <CardContent>
          <Blocks
            isLoading={blocksQuery.isLoading}
            blocks={blocksQuery.data?.data?.blocks}
            limit={PAGE_SIZE}
            verbose={true}
            pagination={true}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
