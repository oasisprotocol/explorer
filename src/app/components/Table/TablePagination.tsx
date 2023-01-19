import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, To } from 'react-router-dom'

export type TablePaginationProps = {
  numberOfPages?: number
  selectedPage: number
  linkToPage: (page: number) => To
}

export const TablePagination: FC<TablePaginationProps> = ({ numberOfPages, selectedPage, linkToPage }) => {
  const { t } = useTranslation()

  return (
    <Pagination
      count={numberOfPages}
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
