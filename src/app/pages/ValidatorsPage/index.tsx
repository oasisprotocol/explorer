import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'

import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Validators } from '../../components/Validators'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { ValidatorDetailsView } from '../ValidatorDetailsPage'
import { VerticalList } from '../../components/VerticalList'
import { useValidatorFiltering, useValidatorData } from './hooks'
import Box from '@mui/material/Box'
import { TableSearchBar } from '../../components/Search/TableSearchBar'

export const ValidatorsPage: FC = () => {
  const [tableView, setTableView] = useState<TableLayout>(TableLayout.Horizontal)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const { network } = scope
  const { nameSearchInput, setNameSearchInput, nameWarning, namePattern } = useValidatorFiltering()

  useEffect(() => {
    if (!isMobile) {
      setTableView(TableLayout.Horizontal)
    }
  }, [isMobile, setTableView])

  const {
    isLoading,
    tablePaginationProps,
    data: validators,
    extractedData,
    hasNoResultsOnSelectedPage,
  } = useValidatorData(network, tableView)

  const { rowsPerPage } = tablePaginationProps
  const [totalCount, isTotalCountClipped] = extractedData ?? [0, false]

  if (hasNoResultsOnSelectedPage) {
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
        action={
          <Box sx={{ display: 'flex-inline' }}>
            <TableSearchBar
              value={nameSearchInput}
              onChange={setNameSearchInput}
              placeholder={t('validator.search')}
              warning={nameWarning}
            />
            {isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
          </Box>
        }
        noPadding={tableView === TableLayout.Vertical}
        mainTitle
      >
        {tableView === TableLayout.Horizontal && (
          <Validators
            validators={validators}
            isLoading={isLoading}
            limit={rowsPerPage}
            pagination={tablePaginationProps}
            highlightedPart={namePattern}
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
