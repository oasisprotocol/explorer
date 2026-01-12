import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutDivider } from '../../components/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { EvmTokenType, useGetRuntimeEvmTokens } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { TableLayoutButton } from '../../components/TableLayoutButton'
import { TableLayout } from '../../components/Table/types'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { TokenList } from '../../components/Tokens/TokenList'
import { TokenDetails } from '../../components/Tokens/TokenDetails'
import { VerticalList } from '../../components/VerticalList'
import { TokenTypeFilter } from '../../components/Tokens/TokenTypeFilter'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'

const PAGE_SIZE = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const TokensPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const [type, setType] = useTypedSearchParam<EvmTokenType>('type', EvmTokenType.ERC20, {
    deleteParams: ['page'],
  })
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRuntimeScope()

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
      type,
    },
    {
      query: {
        // Keep showing data while loading more
        keepPreviousData: tableView === TableLayout.Vertical,
      },
    },
  )

  const { isLoading, isFetched, data } = tokensQuery
  const tokens = data?.data.evm_tokens
  if (isFetched && pagination.selectedPage > 1 && !tokens?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
      }
    >
      {!isMobile && <LayoutDivider />}
      <SubPageCard
        title={t('common.tokens')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
        subheader={
          <span className="ml-4 not-italic">
            <TokenTypeFilter onSelect={setType} value={type} />
          </span>
        }
      >
        {tableView === TableLayout.Horizontal && (
          <TokenList
            isLoading={isLoading}
            tokens={tokens}
            limit={PAGE_SIZE}
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
                <TokenDetails key={key} isLoading={true} token={undefined} standalone />
              ))}

            {!isLoading &&
              tokens!.map(token => <TokenDetails key={token.contract_addr} token={token} standalone />)}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
