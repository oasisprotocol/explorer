import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { RoflInstance } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../../components/Table/TablePagination'
import { RoflAppInstanceStatusBadge } from 'app/components/Rofl/RoflAppInstanceStatusBadge'
import { RouteUtils } from 'app/utils/route-utils'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { SearchScope } from '../../../types/searchScope'

type InstancesListProps = {
  currentEpoch: number | undefined
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
  appId,
  scope,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rak', content: t('rofl.rakAbbreviation') },
    { key: 'node', content: t('rofl.nodeId') },
    { key: 'expirationEpoch', content: t('rofl.expirationEpoch'), align: TableCellAlign.Right },
    { key: 'expirationStatus', content: t('common.status'), align: TableCellAlign.Right },
  ]

  const tableRows =
    currentEpoch !== undefined && instances
      ? instances?.map(instance => {
          const isActive = instance.expiration_epoch > currentEpoch
          const to = RouteUtils.getRoflAppInstanceRoute(scope.network, appId, instance.rak)

          return {
            key: instance.rak,
            backgroundColor: isActive ? 'transparent' : COLORS.grayLight,
            data: [
              {
                key: 'rak',
                content: (
                  <Typography variant="mono">
                    <Link component={RouterLink} to={to}>
                      {instance.rak}
                    </Link>
                  </Typography>
                ),
              },
              {
                key: 'node',
                content: <Typography variant="mono">{instance.endorsing_node_id}</Typography>,
              },
              {
                key: 'expirationEpoch',
                content: instance.expiration_epoch.toLocaleString(),
                align: TableCellAlign.Right,
              },
              {
                key: 'expirationStatus',
                content: <RoflAppInstanceStatusBadge isActive={isActive} />,
                align: TableCellAlign.Right,
              },
            ],
          }
        })
      : undefined

  return (
    <Table
      emptyMessage={t('rofl.emptyInstancesList')}
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
