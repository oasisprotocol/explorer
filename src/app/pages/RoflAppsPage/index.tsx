import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { Layer, RoflApp, useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useScreenSize } from '../../hooks/useScreensize'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { RoflAppsList } from '../../components/Rofl/RoflAppsList'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { VerticalList } from '../../components/VerticalList'
import { RoflAppDetailsView } from '../RoflAppDetailsPage'

const limit = NUMBER_OF_ITEMS_ON_SEPARATE_PAGE

const mockedApps: RoflApp[] = [
  {
    layer: 'sapphire',
    network: 'mainnet',
    ticker: 'ROSE',
    removed: false,
    num_active_instances: 3,
    date_created: '2021-04-28T16:00:00Z',
    last_activity: '2025-03-26T16:00:00Z',
    admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
    id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9zz',
    active_instances: [
      {
        endorsing_entity_id: '',
        endorsing_node_id: '7zI/cYuiUTPz61PL9M7f1Q/7b43nG0xk1w6yGde+msQ=',
        expiration_epoch: 1,
        extra_keys: ['A/Mag19KKuAQp2tDIxHvWIPcMzRGnhnyXWxKAbrsbWF6'],
        rak: 'nzZocZ7VWvjE1N4Z4Y/6hocqL6wW1XhLvnEruEzkq5o=',
        rek: 'ecyl1l93+l2zJ7K2oxqNtNSv8hg+pw1lKVAOfEGjzio=',
      },
    ],
    metadata: { name: 'Foo' },
    policy: {
      enclaves: [
        'vKzu7QwiG1MfNk3FWLFTf/9d3nzNqCB/0BQFM/knsN0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'oF3eJV3947jsy6hKpwdqxS6cy3/xEnIVm6cWIkdrCb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
      ],
      endorsements: [{ any: {} }],
      fees: 2,
      max_expiration: 3,
      quotes: { pcs: { min_tcb_evaluation_data_number: 17, tcb_validity_period: 30, tdx: {} } },
    },
    secrets: {
      foo: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2zBxzZS4buSPZWbQV8l+ZW5vbmNlTypzdpiaAo45zHiAqMst5mV2YWx1ZVTFJjKzfthesm/P4tuLPG3AsVkiIA==',
      API_KEY: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2z',
    },
    sek: '438B4/HJ6nmyzg0v50UxvRiBLn9ZJRa8uzDjpsD18Dw=',
  },
  {
    layer: 'sapphire',
    network: 'mainnet',
    ticker: 'ROSE',
    removed: false,
    num_active_instances: 0,
    date_created: '2021-04-28T16:00:00Z',
    admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
    id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9zz',
    active_instances: [],
    metadata: { name: 'Bar' },
    policy: {
      enclaves: [
        'vKzu7QwiG1MfNk3FWLFTf/9d3nzNqCB/0BQFM/knsN0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'oF3eJV3947jsy6hKpwdqxS6cy3/xEnIVm6cWIkdrCb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
      ],
      endorsements: [{ any: {} }],
      fees: 2,
      max_expiration: 3,
      quotes: { pcs: { min_tcb_evaluation_data_number: 17, tcb_validity_period: 30, tdx: {} } },
    },
    secrets: {
      foo: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2zBxzZS4buSPZWbQV8l+ZW5vbmNlTypzdpiaAo45zHiAqMst5mV2YWx1ZVTFJjKzfthesm/P4tuLPG3AsVkiIA==',
      API_KEY: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2z',
    },
    sek: '438B4/HJ6nmyzg0v50UxvRiBLn9ZJRa8uzDjpsD18Dw=',
  },
  {
    layer: 'sapphire',
    network: 'mainnet',
    ticker: 'ROSE',
    removed: true,
    num_active_instances: 0,
    date_created: '2021-04-28T16:00:00Z',
    admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
    id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9zz',
    active_instances: [
      {
        endorsing_entity_id: '',
        endorsing_node_id: '7zI/cYuiUTPz61PL9M7f1Q/7b43nG0xk1w6yGde+msQ=',
        expiration_epoch: 1,
        extra_keys: ['A/Mag19KKuAQp2tDIxHvWIPcMzRGnhnyXWxKAbrsbWF6'],
        rak: 'nzZocZ7VWvjE1N4Z4Y/6hocqL6wW1XhLvnEruEzkq5o=',
        rek: 'ecyl1l93+l2zJ7K2oxqNtNSv8hg+pw1lKVAOfEGjzio=',
      },
    ],
    metadata: {},
    policy: {
      enclaves: [
        'vKzu7QwiG1MfNk3FWLFTf/9d3nzNqCB/0BQFM/knsN0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
        'oF3eJV3947jsy6hKpwdqxS6cy3/xEnIVm6cWIkdrCb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
      ],
      endorsements: [{ any: {} }],
      fees: 2,
      max_expiration: 3,
      quotes: { pcs: { min_tcb_evaluation_data_number: 17, tcb_validity_period: 30, tdx: {} } },
    },
    secrets: {
      foo: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2zBxzZS4buSPZWbQV8l+ZW5vbmNlTypzdpiaAo45zHiAqMst5mV2YWx1ZVTFJjKzfthesm/P4tuLPG3AsVkiIA==',
      API_KEY: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2z',
    },
    sek: '438B4/HJ6nmyzg0v50UxvRiBLn9ZJRa8uzDjpsD18Dw=',
  },
]

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
            apps={mockedApps}
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
                <RoflAppDetailsView key={key} isLoading={true} app={undefined} />
              ))}
            {!isLoading && mockedApps?.map(app => <RoflAppDetailsView key={app.id} app={app} />)}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
