import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Layer, useGetRuntimeBlocks } from '../../../oasis-indexer/api'
import { Blocks, TableRuntimeBlockList } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { useParams } from 'react-router-dom'
import { AppErrors } from '../../../types/errors'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const BlocksPage: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  // TODO: switch to useLayer when it's available
  const layer = useParams().layer as Layer
  // Consensus is not yet enabled in ENABLED_PARA_TIMES, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus blocks is not yet implemented.
    // we should call useGetConsensusBlocks()
  }
  const blocksQuery = useGetRuntimeBlocks<AxiosResponse<TableRuntimeBlockList>>(
    layer, // This is OK, since consensus is already handled separately
    {
      limit: PAGE_SIZE,
      offset: offset,
    },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        structuralSharing: (previousState, nextState) => {
          const oldBlockIds = new Set(previousState?.data.blocks.map(block => block.round))
          return {
            ...nextState,
            data: {
              ...nextState.data,
              blocks: nextState.data.blocks.map(block => {
                return {
                  ...block,
                  markAsNew: previousState ? !oldBlockIds.has(block.round) : false,
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
          blocks={blocksQuery.data?.data.blocks}
          limit={PAGE_SIZE}
          verbose={true}
          pagination={{
            selectedPage: pagination.selectedPage,
            linkToPage: pagination.linkToPage,
            totalCount: blocksQuery.data?.data.total_count,
            rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
          }}
        />
      </SubPageCard>
    </PageLayout>
  )
}
