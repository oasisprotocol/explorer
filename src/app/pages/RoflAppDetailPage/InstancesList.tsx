import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { RoflInstance } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../../components/Table/TablePagination'

type InstancesListProps = {
  instances: RoflInstance[] | undefined
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const InstancesList: FC<InstancesListProps> = ({ isLoading, limit, pagination, instances }) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rak', content: t('rofl.rak') },
    { key: 'node', content: t('rofl.nodeId') },
    { key: 'expiration', content: t('rofl.expirationEpoch'), align: TableCellAlign.Right },
  ]

  const tableRows = instances?.map(instance => {
    return {
      key: instance.rak,
      data: [
        {
          key: 'rak',
          content: <Typography variant="mono">{instance.rak}</Typography>,
        },
        {
          key: 'node',
          content: <Typography variant="mono">{instance.endorsing_node_id}</Typography>,
        },
        {
          key: 'expiration',
          content: instance.expiration_epoch.toLocaleString(),
          align: TableCellAlign.Right,
        },
      ],
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('rofl.instances')}
      isLoading={isLoading}
      pagination={pagination}
      extraHorizontalSpaceOnMobile
    />
  )
}
