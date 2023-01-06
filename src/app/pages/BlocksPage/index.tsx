import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { Blocks } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const BlocksPage: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const blocksQuery = useGetEmeraldBlocks(
    {
      limit: PAGE_SIZE,
    },
    { query: { refetchInterval: REFETCH_INTERVAL } },
  )

  return (
    <PageLayout>
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard title={t('blocks.latest')}>
        <Blocks
          isLoading={blocksQuery.isLoading}
          blocks={blocksQuery.data?.data?.blocks}
          limit={PAGE_SIZE}
          verbose={true}
          pagination={true}
        />
      </SubPageCard>
    </PageLayout>
  )
}
