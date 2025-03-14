import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Validators } from '../../components/Validators'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { ValidatorDetailsView } from '../ValidatorDetailsPage'
import { VerticalList } from '../../components/VerticalList'

const PAGE_SIZE = 100

export const ValidatorsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const pagination = useSearchParamsPagination('page')
  const offset = (pagination.selectedPage - 1) * PAGE_SIZE
  const scope = useRequiredScopeParam()
  const { network } = scope

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const validatorsQuery = useGetConsensusValidators(network, {
    limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
    offset: tableView === TableLayout.Vertical ? 0 : offset,
  })
  const { isLoading, isFetched, data } = validatorsQuery
  const validatorsData = data?.data
  if (isFetched && offset && !validatorsData?.validators?.length) {
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
        title={
          <CardHeaderWithCounter
            changeMobileColors
            label={t('validator.listTitle')}
            totalCount={validatorsData?.total_count}
            isTotalCountClipped={validatorsData?.is_total_count_clipped}
          />
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <Validators
            stats={validatorsQuery.data?.data.stats}
            validators={validatorsQuery.data?.data.validators}
            isLoading={validatorsQuery.isLoading}
            limit={PAGE_SIZE}
            pagination={{
              selectedPage: pagination.selectedPage,
              linkToPage: pagination.linkToPage,
              totalCount: data?.data.total_count,
              isTotalCountClipped: data?.data.is_total_count_clipped,
              rowsPerPage: PAGE_SIZE,
            }}
          />
        )}
        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(PAGE_SIZE).keys()].map(key => (
                <ValidatorDetailsView
                  network={network}
                  key={key}
                  isLoading={true}
                  validator={undefined}
                  account={undefined}
                  stats={undefined}
                  standalone
                />
              ))}
            {!isLoading &&
              validatorsData?.validators.map(validator => (
                <ValidatorDetailsView
                  network={network}
                  key={validator.entity_address}
                  validator={validator}
                  account={undefined}
                  stats={validatorsQuery.data?.data.stats}
                  standalone
                />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
