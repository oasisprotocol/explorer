import { FC, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { Layer, useGetRuntimeRoflApps } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'
import { useScreenSize } from '../../hooks/useScreensize'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { RoflAppsList, TableRoflAppsList } from '../../components/Rofl/RoflAppsList'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { VerticalList } from '../../components/VerticalList'

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

  const roflAppsQuery = useGetRuntimeRoflApps<AxiosResponse<TableRoflAppsList>>(scope.network, scope.layer, {
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
            apps={[
              {
                status: 'active',
                first_activity: '2021-04-28T16:00:00Z',
                timestamp: '2025-03-10T15:16:38Z',
                version: '0.1.0',
                tee: 'SGX',
                kind: 'container',
                network: 'mainnet',
                amount: '1206.283143168',
                admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
                id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9uw',
                instances: [
                  {
                    endorsing_entity_id: '',
                    endorsing_node_id: '7zI/cYuiUTPz61PL9M7f1Q/7b43nG0xk1w6yGde+msQ=',
                    expiration_epoch: 42244,
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
                status: 'inactive',
                first_activity: '2021-04-28T16:00:00Z',
                timestamp: '2025-03-10T15:16:38Z',
                version: '0.1.0',
                tee: 'SGX',
                kind: 'container',
                network: 'mainnet',
                amount: '1206.283143168',
                admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
                id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9uw',
                instances: [
                  {
                    endorsing_entity_id: '',
                    endorsing_node_id: '7zI/cYuiUTPz61PL9M7f1Q/7b43nG0xk1w6yGde+msQ=',
                    expiration_epoch: 42244,
                    extra_keys: ['A/Mag19KKuAQp2tDIxHvWIPcMzRGnhnyXWxKAbrsbWF6'],
                    rak: 'nzZocZ7VWvjE1N4Z4Y/6hocqL6wW1XhLvnEruEzkq5o=',
                    rek: 'ecyl1l93+l2zJ7K2oxqNtNSv8hg+pw1lKVAOfEGjzio=',
                  },
                ],
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
            ]}
            isLoading={isLoading}
            limit={limit}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: 2,
              isTotalCountClipped: false,
              rowsPerPage: limit,
            }}
          />
        )}

        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading && [...Array(limit).keys()].map(key => <>TODO</>)}
            {!isLoading && data?.data.rofl_apps.map(tx => <>TODO</>)}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
