import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AxiosResponse } from 'axios'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetConsensusBlocks } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { ConsensusBlockDetailView } from '../ConsensusBlockDetailPage'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { ConsensusBlocks, TableConsensusBlockList } from '../../components/Blocks/ConsensusBlocks'
import { useConsensusListBeforeDate } from '../../hooks/useListBeforeDate'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const BlockDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: COLORS.brandDark,
}))

export const ConsensusBlocksPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const enablePolling = offset === 0
  const { beforeDate, setBeforeDateFromCollection } = useConsensusListBeforeDate(scope, offset)

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const blocksQuery = useGetConsensusBlocks<AxiosResponse<TableConsensusBlockList>>(
    scope.network,
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
              const oldBlockIds = new Set(previousState?.data.blocks.map(block => block.height))
              return {
                ...nextState,
                data: {
                  ...nextState.data,
                  blocks: nextState.data.blocks.map(block => {
                    return {
                      ...block,
                      markAsNew: previousState ? !oldBlockIds.has(block.height) : false,
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
        title={t('blocks.title')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <ConsensusBlocks
            isLoading={isLoading}
            blocks={blocks}
            limit={PAGE_SIZE}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
            }}
            showProposer
          />
        )}
        {tableView === TableLayout.Vertical && (
          <BlockDetails>
            {isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <ConsensusBlockDetailView key={key} isLoading={true} block={undefined} standalone />
              ))}
            {!isLoading &&
              data?.data.blocks.map(block => (
                <ConsensusBlockDetailView key={block.hash} block={block} standalone />
              ))}
          </BlockDetails>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
