import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DebondingDelegation, Delegation } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { RoundedBalance } from '../RoundedBalance'
import { ValidatorLink } from '../Validators/ValidatorLink'
import { AccountLink } from '../Account/AccountLink'

type DelegationsProps = {
  debonding?: boolean
  delegations?: Delegation[] | DebondingDelegation[]
  isLoading: boolean
  limit: number
  linkType?: 'delegator' | 'validator'
  pagination: false | TablePaginationProps
}

export const Delegations: FC<DelegationsProps> = ({
  debonding,
  delegations,
  isLoading,
  limit,
  linkType,
  pagination,
}) => {
  const { t } = useTranslation()

  const tableColumns: TableColProps[] = [
    { key: 'delegator', content: linkType === 'validator' ? t('validator.title') : t('common.address') },
    { key: 'amount', content: t('validator.amount'), align: TableCellAlign.Right },
    { key: 'shares', content: t('common.shares'), align: TableCellAlign.Right },
    ...(debonding
      ? [{ key: 'debondingEnd', content: t('validator.debondingEnd'), align: TableCellAlign.Right }]
      : []),
  ]
  const tableRows = delegations?.map(delegation => ({
    key: linkType === 'validator' ? delegation.validator : delegation.delegator,
    data: [
      {
        content:
          linkType === 'validator' ? (
            <ValidatorLink address={delegation.validator} alwaysTrim network={delegation.network} />
          ) : (
            <AccountLink scope={delegation} address={delegation.delegator} />
          ),
        key: 'delegator',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={delegation.amount} />,
        key: 'amount',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance compactLargeNumbers value={delegation.shares} />,
        key: 'shares',
      },
      ...(debonding && 'debond_end' in delegation
        ? [
            {
              align: TableCellAlign.Right,
              content: <>{delegation.debond_end}</>,
              key: 'debondingEnd',
            },
          ]
        : []),
    ],
  }))

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={debonding ? t('validator.undelegations') : t('validator.delegators')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
