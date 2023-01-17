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
  const selectedPage = parseInt(searchParams.get('page') ?? '1', 10)

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
          to={{ search: item.page && item.page > 1 ? `?page=${item.page}` : '' }}
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
