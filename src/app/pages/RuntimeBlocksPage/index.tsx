import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Layer, useGetRuntimeBlocks } from '../../../oasis-nexus/api'
import { RuntimeBlocks, BlocksTableType, TableRuntimeBlockList } from '../../components/Blocks'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { RuntimeBlockDetailView } from '../RuntimeBlockDetailPage'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { VerticalList } from '../../components/VerticalList'
import { useRuntimeListBeforeDate } from '../../hooks/useListBeforeDate'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const RuntimeBlocksPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const enablePolling = offset === 0
  const { beforeDate, setBeforeDateFromCollection } = useRuntimeListBeforeDate(scope, offset)
  // Consensus is not yet enabled in ENABLED_LAYERS, just some preparation
  if (scope.layer === Layer.consensus) {
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
    scope.network,
    scope.layer, // This is OK, since consensus is already handled separately
    {
      limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
      before: enablePolling ? undefined : beforeDate,
    },
    {
      query: {
        enabled: enablePolling || !!beforeDate,
        refetchInterval: enablePolling ? REFETCH_INTERVAL : undefined,
        structuralSharing: enablePolling
          ? (previousState, nextState) => {
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
            }
          : undefined,
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  const { isLoading, isFetched, data } = blocksQuery
  const blocks = data?.data.blocks
  setBeforeDateFromCollection(data?.data.blocks[0].timestamp)

  if (isFetched && offset && !blocks?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('blocks.latest')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <RuntimeBlocks
            isLoading={isLoading}
            blocks={blocks}
            limit={PAGE_SIZE}
            type={BlocksTableType.Desktop}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
            }}
          />
        )}
        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <RuntimeBlockDetailView key={key} isLoading={true} block={undefined} standalone />
              ))}
            {!isLoading &&
              data?.data.blocks.map(block => (
                <RuntimeBlockDetailView key={block.hash} block={block} standalone />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
