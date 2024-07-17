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
    { key: 'delegator', content: t('common.address'), hide: linkType === 'validator' },
    { key: 'validator', content: t('validator.title'), hide: linkType !== 'validator' },
    { key: 'amount', content: t('validator.amount'), align: TableCellAlign.Right },
    { key: 'shares', content: t('common.shares'), align: TableCellAlign.Right },
    ...(debonding
      ? [{ key: 'debondingEnd', content: t('validator.debondingEnd'), align: TableCellAlign.Right }]
      : []),
  ]
  const tableRows = delegations?.map(delegation => ({
    key: `${delegation.delegator}${delegation.validator}${debonding ? 'debond_end' in delegation && delegation.debond_end : ''}`,
    data: [
      {
        content: <AccountLink scope={delegation} address={delegation.delegator} />,
        hide: linkType === 'validator',
        key: 'delegator',
      },
      {
        content: <ValidatorLink address={delegation.validator} alwaysTrim network={delegation.network} />,
        hide: linkType !== 'validator',
        key: 'validator',
      },
      {
        align: TableCellAlign.Right,
        content: <RoundedBalance value={delegation.amount} ticker={delegation.ticker} />,
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
