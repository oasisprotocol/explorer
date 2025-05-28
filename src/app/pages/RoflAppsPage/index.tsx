import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { Runtime } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { paraTimesConfig } from '../../../config'
import { useScreenSize } from '../../hooks/useScreensize'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { RoflAppsList } from '../../components/Rofl/RoflAppsList'

import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { VerticalList } from '../../components/VerticalList'
import { RoflAppDetailsVerticalListView } from '../RoflAppDetailsPage'
import { useROFLAppFiltering, useRoflApps, useTableViewMode } from './hook'
import { NoMatchingDataMaybeClearFilters, TableSearchBar } from '../../components/Search/TableSearchBar'
import { Network } from '../../../types/network'
import { ErrorBoundary } from '../../components/ErrorBoundary'

const RoflAppsView: FC<{ network: Network; layer: Runtime; tableView: TableLayout }> = ({
  network,
  layer,
  tableView,
}) => {
  const { wantedNamePattern, clearFilters } = useROFLAppFiltering()

  const {
    tablePagination,
    isLoading,
    roflApps,
    limit,
    hasNoResultsOnSelectedPage,
    hasNoResultsBecauseOfFilters,
  } = useRoflApps(network, layer)

  if (hasNoResultsOnSelectedPage) {
    throw AppErrors.PageDoesNotExist
  }

  if (hasNoResultsBecauseOfFilters) {
    return <NoMatchingDataMaybeClearFilters clearFilters={clearFilters} />
  }

  return (
    <>
      {tableView === TableLayout.Horizontal && (
        <RoflAppsList
          apps={roflApps}
          isLoading={isLoading}
          limit={limit}
          pagination={tablePagination}
          highlightedPartOfName={wantedNamePattern}
        />
      )}

      {tableView === TableLayout.Vertical && (
        <VerticalList>
          {isLoading &&
            [...Array(limit).keys()].map(key => (
              <RoflAppDetailsVerticalListView key={key} isLoading={true} app={undefined} />
            ))}
          {!isLoading &&
            roflApps?.map(app => (
              <RoflAppDetailsVerticalListView
                key={app.id}
                app={app}
                highlightedPartOfName={wantedNamePattern}
              />
            ))}
        </VerticalList>
      )}
    </>
  )
}

export const RoflAppsPage: FC = () => {
  const { tableView, setTableView } = useTableViewMode()
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const { wantedNameInput, setWantedNameInput, nameError } = useROFLAppFiltering()
  const { network, layer } = useRuntimeScope()

  if (!paraTimesConfig[layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  const { pagination, isLoading, hasNoResultsBecauseOfFilters } = useRoflApps(network, layer)

  const searchBar = (
    <TableSearchBar
      value={wantedNameInput}
      onChange={setWantedNameInput}
      placeholder={t('rofl.searchByNameOrKeyword')}
      warning={nameError}
      fullWidth={isMobile}
      autoFocus={!isMobile}
    />
  )

  return (
    <PageLayout
      mobileFooterAction={
        tableView === TableLayout.Vertical &&
        !hasNoResultsBecauseOfFilters && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
      }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={t('rofl.listTitle')}
        action={
          isMobile ? <TableLayoutButton tableView={tableView} setTableView={setTableView} /> : searchBar
        }
        title2={isMobile && searchBar}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        <ErrorBoundary>
          <RoflAppsView network={network} layer={layer} tableView={tableView} />
        </ErrorBoundary>
      </SubPageCard>
    </PageLayout>
  )
}
