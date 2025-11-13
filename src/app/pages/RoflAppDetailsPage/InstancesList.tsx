import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflInstance } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'
import { RoflAppInstanceLink } from '../../components/Rofl/RoflAppInstanceLink'
import { TableCellNode } from '../../components/TableCellNode'
import { TableHeaderNode } from '../../components/TableHeaderNode'
import { formatDistanceToNow } from '../../utils/dateFormatter'

type InstancesListProps = {
  currentEpoch: number | undefined
  currentEpochTimestamp: string | undefined
  instances: RoflInstance[] | undefined
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  appId: string
  scope: SearchScope
}

export const InstancesList: FC<InstancesListProps> = ({
  isLoading,
  limit,
  pagination,
  instances,
  currentEpoch,
  currentEpochTimestamp,
  appId,
  scope,
}) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'rak', content: t('rofl.rakAbbreviation') },
    { key: 'node', content: <TableHeaderNode /> },
    { key: 'expirationEpoch', content: t('rofl.expirationEpoch'), align: TableCellAlign.Right },
    { key: 'expirationStatus', content: t('common.status'), align: TableCellAlign.Right },
  ]
  const tableRows =
    currentEpoch !== undefined && currentEpochTimestamp && instances
      ? instances?.map(instance => {
          const isActive = instance.expiration_epoch > currentEpoch

          // Approximately 1 epoch per hour
          const approxExpiration = new Date(currentEpochTimestamp)
          approxExpiration.setHours(approxExpiration.getHours() + instance.expiration_epoch - currentEpoch)

          return {
            key: instance.rak,
            backgroundColor: isActive ? 'transparent' : COLORS.grayLight50A,
            data: [
              {
                key: 'rak',
                content: <RoflAppInstanceLink id={appId} network={scope.network} rak={instance.rak} mono />,
              },
              {
                key: 'node',
                content: <TableCellNode id={instance.endorsing_node_id} scope={scope} />,
              },
              {
                key: 'expirationEpoch',
                content: (
                  <span>
                    {instance.expiration_epoch.toLocaleString()} (
                    {formatDistanceToNow(approxExpiration, { keepSuffix: true })})
                  </span>
                ),
                align: TableCellAlign.Right,
              },
              {
                key: 'expirationStatus',
                content: (
                  <Badge variant={isActive ? 'success' : 'warning'}>
                    {isActive ? t('rofl.active') : t('rofl.expired')}
                  </Badge>
                ),
                align: TableCellAlign.Right,
              },
            ],
          }
        })
      : undefined

  return (
    <Table
      emptyMessage={t('rofl.emptyReplicasList')}
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('rofl.replicas')}
      isLoading={isLoading}
      pagination={pagination}
      extraHorizontalSpaceOnMobile
    />
  )
}
