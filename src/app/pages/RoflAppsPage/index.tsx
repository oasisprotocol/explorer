import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
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

import { useRoflApps, useTableViewMode } from './hook'

export const RoflAppsPage: FC = () => {
  const { tableView, setTableView } = useTableViewMode()
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const scope = useRuntimeScope()

  if (!paraTimesConfig[scope.layer]?.offerRoflTxTypes) throw AppErrors.UnsupportedLayer

  const { pagination, tablePagination, isLoading, roflApps, limit, hasNoResultsOnSelectedPage } = useRoflApps(
    scope.network,
    scope.layer,
  )

  if (hasNoResultsOnSelectedPage) {
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
          <RoflAppsList apps={roflApps} isLoading={isLoading} limit={limit} pagination={tablePagination} />
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
