import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSearchParamsPagination } from './useSearchParamsPagination'

type TablePaginationProps = {
  /** Number of pages */
  count: number
  /** Page size */
  rowsNumber: number
}

export const TablePagination: FC<TablePaginationProps> = ({ count }) => {
  const { t } = useTranslation()
  const { selectedPage, linkToPage } = useSearchParamsPagination('page')

  return (
    <Pagination
      count={count}
      page={selectedPage}
      renderItem={item => (
        <PaginationItem
          slots={{
            first: () => <>{t('pagination.first')}</>,
            last: () => <>{t('pagination.last')}</>,
          }}
          component={Link}
          to={item.page == null ? '' : linkToPage(item.page)}
          {...item}
        />
      )}
      showFirstButton
      showLastButton
      size="small"
      sx={{ marginTop: 5 }}
    />
  )
}
