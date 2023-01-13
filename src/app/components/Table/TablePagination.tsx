import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

type TablePaginationProps = {
  /** Number of pages */
  count: number
  /** Page size */
  rowsNumber: number
}

export const TablePagination: FC<TablePaginationProps> = ({ count, rowsNumber }) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const offsetSearchQuery = searchParams.get('offset')
  const offset = (offsetSearchQuery && parseInt(offsetSearchQuery, 10)) || 0
  const page = offset ? offset / rowsNumber + 1 : 1

  return (
    <Pagination
      count={count}
      page={page}
      renderItem={item => (
        <PaginationItem
          slots={{
            first: () => <>{t('pagination.first')}</>,
            last: () => <>{t('pagination.last')}</>,
          }}
          component={Link}
          to={{ search: item.page && item.page > 1 ? `?offset=${(item.page - 1) * rowsNumber}` : '' }}
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
