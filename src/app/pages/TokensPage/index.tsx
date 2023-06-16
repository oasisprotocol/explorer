import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Layer, useGetRuntimeEvmTokens } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE, REFETCH_INTERVAL } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { TokenList } from '../../components/Tokens/TokenList'
import { TokenDetails } from '../../components/Tokens/TokenDetails'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const TokenDetailsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `0 ${theme.spacing(2)}`,
  backgroundColor: COLORS.brandDark,
}))

export const TokensPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
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

  const tokensQuery = useGetRuntimeEvmTokens(
    scope.network,
    scope.layer, // This is OK, since consensus is already handled separately
    {
      limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
    },
    {
      query: {
        refetchInterval: REFETCH_INTERVAL,
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && (
          <LoadMoreButton pagination={pagination} isLoading={tokensQuery.isLoading} />
        )
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('tokens.title')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
          <TokenList
            isLoading={tokensQuery.isLoading}
            tokens={tokensQuery.data?.data.evm_tokens}
            limit={PAGE_SIZE}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: tokensQuery.data?.data.total_count,
              isTotalCountClipped: tokensQuery.data?.data.is_total_count_clipped,
              rowsPerPage: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
            }}
          />
        )}
        {tableView === TableLayout.Vertical && (
          <TokenDetailsBox>
            {tokensQuery.isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <TokenDetails key={key} isLoading={true} token={undefined} standalone />
              ))}

            {!tokensQuery.isLoading &&
              tokensQuery.data?.data.evm_tokens.map(token => (
                <TokenDetails key={token.contract_addr} token={token} standalone />
              ))}
          </TokenDetailsBox>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
