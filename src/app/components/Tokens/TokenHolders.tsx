import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { BareTokenHolder } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { fromBaseUnits } from '../../utils/helpers'
import { TokenPriceInfo } from '../../../coin-gecko/api'

type TableTokenHolder = BareTokenHolder & {
  markAsNew?: boolean
}

type TokenHoldersProps = {
  holders: TableTokenHolder[] | undefined
  isLoading: boolean
  decimals: number | undefined
  totalSupply: string | undefined
  limit: number
  tokenPrice?: TokenPriceInfo
  pagination: false | TablePaginationProps
}

export const TokenHolders: FC<TokenHoldersProps> = ({
  isLoading,
  limit,
  pagination,
  holders,
  decimals = 18,
  totalSupply,
  tokenPrice,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rank', content: t('common.rank'), align: TableCellAlign.Center },
    { key: 'address', content: t('common.address') },
    { key: 'quantity', content: t('common.quantity'), align: TableCellAlign.Right },
    { key: 'percentage', content: t('common.percentage'), align: TableCellAlign.Right },
    ...(tokenPrice
      ? [{ key: 'value', align: TableCellAlign.Right, content: t('common.value'), width: '250px' }]
      : []),
  ]

  const calculateRatio = (balance: string): string => {
    return totalSupply === undefined
      ? t('common.missing')
      : `${((100 * parseFloat(fromBaseUnits(balance, decimals))) / parseFloat(totalSupply)).toFixed(4)}%`
  }

  const tableRows = holders?.map((holder, index) => {
    return {
      key: holder.holder_address,
      data: [
        {
          key: 'rank',
          content: holder.rank.toLocaleString(),
          align: TableCellAlign.Center,
        },
        {
          key: 'address',
          content: (
            <AccountLink scope={holder} address={holder.eth_holder_address || holder.holder_address} />
          ),
        },
        {
          key: 'quantity',
          content: t('tokens.totalSupplyValue', { value: fromBaseUnits(holder.balance, decimals) }),
          align: TableCellAlign.Right,
        },
        {
          key: 'percentage',
          content: calculateRatio(holder.balance),
          align: TableCellAlign.Right,
        },
        ...(tokenPrice?.price
          ? [
              {
                key: 'value',
                content: t('common.fiatValueInUSD', {
                  value: parseFloat(fromBaseUnits(holder.balance, decimals)) * tokenPrice.price,
                  formatParams: {
                    value: {
                      currency: 'USD',
                    } satisfies Intl.NumberFormatOptions,
                  },
                }),

                align: TableCellAlign.Right,
              },
            ]
          : []),
      ],
      highlight: holder.markAsNew,
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('transactions.latest')}
      isLoading={isLoading}
      pagination={pagination}
      extraHorizontalSpaceOnMobile
    />
  )
}
