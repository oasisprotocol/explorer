import { FC } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../Pagination'

type TablePaginationProps = {
  count: number
  rowsNumber: number
}

export const TablePagination: FC<TablePaginationProps> = ({ count, rowsNumber }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const offsetSearchQuery = searchParams.get('offset')
  const offset = offsetSearchQuery ? parseInt(offsetSearchQuery, 10) : 0
  const page = offset / rowsNumber + 1

  return (
    <Pagination
      count={count}
      page={page}
      onChange={(e, newPage) =>
        setSearchParams({
          offset: `${(newPage - 1) * rowsNumber}`,
        })
      }
    />
  )
}
