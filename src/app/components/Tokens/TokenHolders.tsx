import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableColProps } from '../Table'
import { TableCellAlign } from '../Table/types'
import { BareTokenHolder } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { RoundedBalance } from '../RoundedBalance'
import { Progress } from '@oasisprotocol/ui-library/src/components/progress'
import { fromBaseUnits } from '../../utils/number-utils'

type TableTokenHolder = BareTokenHolder & {
  markAsNew?: boolean
}

type TokenHoldersProps = {
  holders: TableTokenHolder[] | undefined
  isLoading: boolean
  decimals: number
  totalSupply: string | undefined
  limit: number
  pagination: false | TablePaginationProps
}

export const TokenHolders: FC<TokenHoldersProps> = ({
  isLoading,
  limit,
  pagination,
  holders,
  decimals,
  totalSupply,
}) => {
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'rank', content: t('common.rank') },
    { key: 'address', content: t('common.address') },
    { key: 'quantity', content: t('common.quantity'), align: TableCellAlign.Right },
    { key: 'percentage', content: t('common.percentage'), align: TableCellAlign.Right },
  ]

  const calculateRatio = (balance: string, totalSupply: string, decimals: number): number => {
    return (100 * parseFloat(fromBaseUnits(balance, decimals))) / parseFloat(totalSupply)
  }

  const tableRows = holders?.map((holder, index) => {
    return {
      key: holder.holder_address,
      data: [
        {
          key: 'rank',
          content: holder.rank.toLocaleString(),
        },
        {
          key: 'address',
          content: (
            <AccountLink
              scope={holder}
              address={holder.eth_holder_address || holder.holder_address}
              alwaysTrim
            />
          ),
        },
        {
          key: 'quantity',
          content: <RoundedBalance value={fromBaseUnits(holder.balance, decimals)} />,
          align: TableCellAlign.Right,
        },
        {
          key: 'percentage',
          content: (
            <>
              {totalSupply ? (
                <div className="flex items-center justify-end gap-4">
                  {`${calculateRatio(holder.balance, totalSupply, decimals).toFixed(4)}%`}
                  <Progress
                    value={calculateRatio(holder.balance, totalSupply, decimals)}
                    className="w-[85px]"
                  />
                </div>
              ) : (
                <div>{t('common.missing')}</div>
              )}
            </>
          ),
          align: TableCellAlign.Right,
        },
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
