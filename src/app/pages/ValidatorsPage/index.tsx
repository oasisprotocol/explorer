import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'

import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Validators } from '../../components/Validators'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { ValidatorDetailsView } from '../ValidatorDetailsPage'
import { VerticalList } from '../../components/VerticalList'
import { useLoadedValidators } from './hooks'

export const ValidatorsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const { network } = scope

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const {
    isLoading,
    isFetched,
    paginatedResults,
    // pagination, pageSize, isLoading, isFetched, validatorsData
  } = useLoadedValidators(network, tableView)

  const { tablePaginationProps, data: validators } = paginatedResults
  const { selectedPage, totalCount, isTotalCountClipped, rowsPerPage } = tablePaginationProps

  if (isFetched && selectedPage > 1 && !validators?.length) {
    throw AppErrors.PageDoesNotExist
  }

  return (
    <PageLayout
    // mobileFooterAction={
    //   tableView === TableLayout.Vertical && <LoadMoreButton pagination={pagination} isLoading={isLoading} />
    // }
    >
      {!isMobile && <Divider variant="layout" />}
      <SubPageCard
        title={
          <CardHeaderWithCounter
            changeMobileColors
            label={t('validator.listTitle')}
            totalCount={totalCount}
            isTotalCountClipped={isTotalCountClipped}
          />
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <Validators
            validators={validators}
            isLoading={isLoading}
            limit={rowsPerPage}
            pagination={tablePaginationProps}
          />
        )}
        {tableView === TableLayout.Vertical && (
          <VerticalList>
            {isLoading &&
              [...Array(rowsPerPage).keys()].map(key => (
                <ValidatorDetailsView key={key} isLoading={true} validator={undefined} standalone />
              ))}
            {!isLoading &&
              validators?.map(validator => (
                <ValidatorDetailsView key={validator.entity_address} validator={validator} standalone />
              ))}
          </VerticalList>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
