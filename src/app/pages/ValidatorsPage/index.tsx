import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { useGetConsensusValidators } from '../../../oasis-nexus/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE as PAGE_SIZE } from '../../config'
import { useSearchParamsPagination } from '../../components/Table/useSearchParamsPagination'
import { AppErrors } from '../../../types/errors'
import { TableLayout, TableLayoutButton } from '../../components/TableLayoutButton'
import { LoadMoreButton } from '../../components/LoadMoreButton'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Validators } from '../../components/Validators'
import { COLORS } from 'styles/theme/colors'

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

  const validatorsQuery = useGetConsensusValidators(
    network,
    {
      limit: tableView === TableLayout.Vertical ? offset + PAGE_SIZE : PAGE_SIZE,
      offset: tableView === TableLayout.Vertical ? 0 : offset,
    },
    {
      query: {
        cacheTime: 0,
      },
    },
  )
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
          <>
            {t('validator.listTitle')}{' '}
            {validatorsData?.total_count && (
              <Typography component="span" sx={{ color: COLORS.grayMedium, fontSize: 18, fontWeight: 700 }}>
                ({validatorsData?.total_count})
              </Typography>
            )}
          </>
        }
        action={isMobile && <TableLayoutButton tableView={tableView} setTableView={setTableView} />}
        noPadding={tableView === TableLayout.Vertical}
      >
        {tableView === TableLayout.Horizontal && (
          <Validators
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
          // TODO: Add when Account details are implemented
          <></>
        )}
      </SubPageCard>
    </PageLayout>
  )
}
