import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Layer, useGetRuntimeBlocks } from '../../../oasis-indexer/api'
import { Blocks, TableRuntimeBlockList } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { BlockDetailView } from '../BlockDetailPage'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const BlockDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: COLORS.persianBlue,
}))

export const BlocksPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus blocks is not yet implemented.
    // we should call useGetConsensusBlocks()
  }

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const blocksQuery = useGetRuntimeBlocks<AxiosResponse<TableRuntimeBlockList>>(
    layer, // This is OK, since consensus is already handled separately
    {
      limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
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
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && (
          <LoadMoreButton pagination={pagination} isLoading={blocksQuery.isLoading} />
        )
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('blocks.latest')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
          <Blocks
            isLoading={blocksQuery.isLoading}
            blocks={blocksQuery.data?.data.blocks}
            limit={PAGE_SIZE}
            verbose={true}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: blocksQuery.data?.data.total_count,
              isTotalCountClipped: blocksQuery.data?.data.is_total_count_clipped,
              rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
            }}
          />
        )}
        {tableView === TableLayout.Vertical && (
          <BlockDetails>
            {blocksQuery.isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <BlockDetailView key={key} isLoading={true} block={undefined} standalone />
              ))}
            {!blocksQuery.isLoading &&
              blocksQuery.data?.data.blocks.map(block => (
                <BlockDetailView key={block.hash} block={block} standalone />
              ))}
          </BlockDetails>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
