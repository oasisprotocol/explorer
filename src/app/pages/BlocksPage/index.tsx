import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { Blocks, TableRuntimeBlockList } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParams } from 'react-router-dom'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const BlocksPage: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const selectedPage = parseInt(searchParams.get('page') ?? '1', 10)
  const offset = (selectedPage - 1) * PAGE_SIZE
  const blocksQuery = useGetEmeraldBlocks<AxiosResponse<TableRuntimeBlockList>>(
    {
      limit: PAGE_SIZE,
      offset: offset,
    },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          const oldBlockIds = new Set(previousState?.data?.blocks?.map(block => block.round!))
          return {
            ...nextState,
            data: {
              blocks: nextState.data?.blocks?.map(block => {
                return {
                  ...block,
                  markAsNew: previousState ? !oldBlockIds.has(block.round!) : false,
                }
              }),
            },
          }
        },
      },
    },
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
