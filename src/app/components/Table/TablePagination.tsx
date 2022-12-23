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
  const offset = (offsetSearchQuery && parseInt(offsetSearchQuery, 10)) || 0
  const page = offset ? offset / rowsNumber + 1 : 1

  return (
    <Pagination
      count={count}
      page={page}
      onChange={(e, newPage) => {
        const newOffset = (newPage - 1) * rowsNumber
        if (newOffset) {
          setSearchParams({
            offset: `${newOffset}`,
          })
        } else {
          searchParams.delete('offset')
          setSearchParams(searchParams)
        }
      }}
    />
  )
}
