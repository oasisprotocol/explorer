import { Runtime, useGetRuntimeRoflApps } from 'oasis-nexus/api'
import { TableLayout } from '../../components/TableLayoutButton'
import { useEffect, useState } from 'react'
import { useScreenSize } from '../../hooks/useScreensize'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { Network } from '../../../types/network'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const useTableViewMode = () => {
  const { isMobile } = useScreenSize()
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  return { tableView, setTableView }
}

export const useRoflApps = (network: Network, layer: Runtime) => {
  const { tableView } = useTableViewMode()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const roflAppsQuery = useGetRuntimeRoflApps(network, layer, {
    limit: tableView === TableLayout.Vertical ? offset + limit : limit,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = roflAppsQuery
  const roflApps = data?.data.rofl_apps

  const tablePagination: TablePaginationProps = {
    selectedPage: pagination.selectedPage,
    linkToPage: pagination.linkToPage,
    totalCount: data?.data.total_count,
    isTotalCountClipped: data?.data.is_total_count_clipped,
    rowsPerPage: limit,
  }

  const hasNoResultsOnSelectedPage = isFetched && pagination.selectedPage > 1 && !roflApps?.length

  return {
    isLoading,
    limit,
    roflApps,
    pagination,
    tablePagination,
    hasNoResultsOnSelectedPage,
  }
}
