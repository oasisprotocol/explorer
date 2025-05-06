import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { Layer, useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../../config'
import { useScreenSize } from '../../hooks/useScreensize'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { RoflAppsList } from '../../components/Rofl/RoflAppsList'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { VerticalList } from '../../components/VerticalList'
import { RoflAppDetailsVerticalListView } from '../RoflAppDetailsPage'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

export const RoflAppsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * limit
  const scope = useRequiredScopeParam()

  if (scope.layer !== Layer.sapphire) {
    throw AppErrors.UnsupportedLayer
  }

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const roflAppsQuery = useGetRuntimeRoflApps(scope.network, scope.layer, {
    limit: tableView === TableLayout.Vertical ? offset + limit : limit,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = roflAppsQuery
  const roflApps = data?.data.rofl_apps

  if (isFetched && pagination.selectedPage > 1 && !roflApps?.length) {
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
        title={t('rofl.listTitle')}
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <RoflAppsList
            apps={roflApps}
            isLoading={isLoading}
            limit={limit}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: limit,
            }}
          />
        )}

        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(limit).keys()].map(key => (
                <RoflAppDetailsVerticalListView key={key} isLoading={true} app={undefined} />
              ))}
            {!isLoading && roflApps?.map(app => <RoflAppDetailsVerticalListView key={app.id} app={app} />)}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
