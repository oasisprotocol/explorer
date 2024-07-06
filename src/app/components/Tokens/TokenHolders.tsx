import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { BareTokenHolder } from '../../../oasis-nexus/api'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { RoundedBalance } from '../RoundedBalance'
import { ProgressBar } from '../ProgressBar'
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} gap={4}>
                  {`${calculateRatio(holder.balance, totalSupply, decimals).toFixed(4)}%`}
                  <ProgressBar
                    value={calculateRatio(holder.balance, totalSupply, decimals)}
                    variant="determinate"
                  />
                </Box>
              ) : (
                <Box>{t('common.missing')}</Box>
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
