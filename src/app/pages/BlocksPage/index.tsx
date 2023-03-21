import { FC, useState } from 'react'
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
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { AppErrors } from '../../../types/errors'
import { useLayerParam } from '../../hooks/useLayerParam'
import { TableView, TableViewSpeedDial } from '../../components/TableViewSpeedDial'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const BlockDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: COLORS.persianBlue,
}))

const LoadMoreButton = styled(Button)(() => ({
  backgroundColor: COLORS.brandDark,
}))

export const BlocksPage: FC = () => {
  const [tableView, setTableView] = useState<TableView>(TableView.Horizontal)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const layer = useLayerParam()
  // Consensus is not yet enabled in ENABLED_PARA_TIMES, just some preparation
  if (layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
    // Listing the latest consensus blocks is not yet implemented.
    // we should call useGetConsensusBlocks()
  }
  const blocksQuery = useGetRuntimeBlocks<AxiosResponse<TableRuntimeBlockList>>(
    layer, // This is OK, since consensus is already handled separately
    {
      limit: tableView === TableView.Vertical ? offset || PAGE_SIZE : PAGE_SIZE,
      offset,
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
        keepPreviousData: tableView === TableView.Vertical,
      },
    },
  )

  return (
    <PageLayout
      mobileFooterAction={
        <Link component={RouterLink} to={pagination.linkToPage(pagination.selectedPage + 1)}>
          <LoadMoreButton color="primary" variant="contained" disabled={blocksQuery.isLoading}>
            {t('common.loadMore')}
          </LoadMoreButton>
        </Link>
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('blocks.latest')}
        action={isMobile && <TableViewSpeedDial tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableView.Vertical}
      >
        {tableView === TableView.Horizontal && (
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
        {tableView === TableView.Vertical && (
          <BlockDetails>
            {blocksQuery.data?.data.blocks.map(block => (
              <SubPageCard featured key={block.hash} noPadding>
                <BlockDetailView isLoading={blocksQuery.isLoading} block={block} withPadding />
              </SubPageCard>
            ))}
          </BlockDetails>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
