import { Runtime, useGetRuntimeRoflApps } from 'oasis-nexus/api'
import { TableLayout } from '../../components/TableLayoutButton'
import { useEffect, useState } from 'react'
import { useScreenSize } from '../../hooks/useScreensize'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { Network } from '../../../types/network'
import { useTranslation } from 'react-i18next'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { textSearch } from '../../components/Search/search-utils'
import { getHighlightPattern } from '../../components/Search/search-utils'
import { useSearchParams } from 'react-router-dom'

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

export const useROFLAppFiltering = () => {
  const setSearchParams = useSearchParams()[1]
  const { t } = useTranslation()
  const [wantedNameInput, setWantedNameInput] = useTypedSearchParam('name', '', { deleteParams: ['page'] })
  const search = textSearch.roflAppName(wantedNameInput, t)
  const { result: wantedNamePattern, warning: nameError } = search
  const highlightPattern = getHighlightPattern(search)
  const hasFilters = !!wantedNamePattern.length
  const clearFilters = () => {
    setSearchParams(searchParams => {
      searchParams.delete('name')
      searchParams.delete('page')
      return searchParams
    })
  }
  return {
    wantedNameInput,
    setWantedNameInput,
    nameError,
    wantedNamePattern,
    highlightPattern,
    hasFilters,
    clearFilters,
  }
}

export const useRoflApps = (network: Network, layer: Runtime) => {
  const { tableView } = useTableViewMode()
  const pagination = useSearchParamsPagination('page')
  const { wantedNamePattern, hasFilters } = useROFLAppFiltering()
  const offset = (pagination.selectedPage - 1) * limit
  const roflAppsQuery = useGetRuntimeRoflApps(network, layer, {
    name: wantedNamePattern,
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

  const hasData = !!roflApps?.length
  const isOnFirstPage = pagination.selectedPage === 1

  const hasNoResultsOnSelectedPage = isFetched && !isOnFirstPage && !hasData
  const hasNoResultsBecauseOfFilters = !isLoading && !hasData && isOnFirstPage && hasFilters

  return {
    isLoading,
    limit,
    roflApps,
    pagination,
    tablePagination,
    hasNoResultsOnSelectedPage,
    hasNoResultsBecauseOfFilters,
  }
}
