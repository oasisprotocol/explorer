import { useTranslation } from 'react-i18next'
import { EvmToken } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { TokenLink } from './TokenLink'
import { CopyToClipboard } from '../CopyToClipboard'

type TokensProps = {
  tokens?: EvmToken[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const TokenList = (props: TokensProps) => {
  const { isLoading, tokens, pagination, limit } = props
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'index', content: '' },
    { key: 'name', content: t('common.name') },
    { key: 'contract', content: t('common.smartContract') },
    {
      key: 'holders',
      content: t('tokens.holdersCount'),
      align: TableCellAlign.Right,
    },
    { key: 'supply', content: t('tokens.totalSupply'), align: TableCellAlign.Right },
    { key: 'ticker', content: t('common.ticker'), align: TableCellAlign.Right },
  ]

  const tableRows = tokens?.map((token, index) => {
    return {
      key: token.contract_addr,
      data: [
        {
          content: (
            (pagination ? (pagination.selectedPage - 1) * pagination.rowsPerPage : 0) +
            index +
            1
          ).toLocaleString(),
          key: 'index',
        },
        {
          content: (
            <TokenLink
              scope={token}
              address={token.eth_contract_addr ?? token.contract_addr}
              name={token.name}
            />
          ),
          key: 'name',
        },
        {
          content: (
            <span>
              <AccountLink scope={token} address={token.eth_contract_addr ?? token.contract_addr} />
              <CopyToClipboard value={token.eth_contract_addr ?? token.contract_addr} />
            </span>
          ),
          key: 'contactAddress',
        },
        {
          content: token.num_holders.toLocaleString(),
          key: 'holdersCount',
          align: TableCellAlign.Right,
        },
        {
          content: token.total_supply,
          key: 'supply',
          align: TableCellAlign.Right,
        },
        {
          content: token.symbol,
          key: 'ticker',
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
      name={t('common.tokens')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
