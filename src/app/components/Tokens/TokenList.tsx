import { useTranslation } from 'react-i18next'
import { EvmToken, EvmTokenType } from '../../../oasis-nexus/api'
import { Table, TableColProps } from '../../components/Table'
import { TableCellAlign } from '../../components/Table/types'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { TokenLinkWithIcon } from './TokenLinkWithIcon'
import { CopyToClipboard } from '../CopyToClipboard'
import { VerificationIcon } from '../ContractVerificationIcon'
import { FC } from 'react'
import { RoundedBalance } from '../RoundedBalance'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

type TokensProps = {
  tokens?: EvmToken[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const TokenTypeTag: FC<{ tokenType: EvmTokenType | undefined }> = ({ tokenType }) => {
  const { t } = useTranslation()

  if (tokenType === 'ERC20') {
    return (
      <Badge variant="token-erc-20">
        {t('common.token')} <span className="font-normal">({t('account.ERC20')})</span>
      </Badge>
    )
  } else if (tokenType === 'ERC721') {
    return (
      <Badge variant="token-erc-721">
        {t('common.nft')} <span className="font-normal">({t('account.ERC721')})</span>
      </Badge>
    )
  }

  return <Badge>{t('common.missing')}</Badge>
}

export const TokenList = (props: TokensProps) => {
  const { isLoading, tokens, pagination, limit } = props
  const { t } = useTranslation()
  const tableColumns: TableColProps[] = [
    { key: 'index', content: '' },
    { key: 'name', content: t('common.name') },
    { key: 'supply', content: t('tokens.totalSupply'), align: TableCellAlign.Right },
    { key: 'ticker', content: t('common.ticker'), align: TableCellAlign.Left },
    { key: 'contract', content: t('common.smartContract') },
    {
      key: 'verification',
      content: t('contract.verification.source'),
    },
    {
      key: 'holders',
      content: t('tokens.holders'),
      align: TableCellAlign.Right,
    },
    { key: 'type', content: t('common.type'), align: TableCellAlign.Right },
  ]

  const tableRows = tokens?.map((token, index) => {
    return {
      key: token.contract_addr,
      data: [
        {
          key: 'index',
          content: (
            (pagination ? (pagination.selectedPage - 1) * pagination.rowsPerPage : 0) +
            index +
            1
          ).toLocaleString(),
        },
        {
          key: 'name',
          content: (
            <TokenLinkWithIcon
              scope={token}
              address={token.eth_contract_addr ?? token.contract_addr}
              name={token.name}
              alwaysTrim
            />
          ),
        },
        {
          key: 'supply',
          content: <RoundedBalance compactLargeNumbers value={token.total_supply} />,
          align: TableCellAlign.Right,
        },
        {
          key: 'ticker',
          content: token.symbol,
          align: TableCellAlign.Left,
        },
        {
          key: 'contactAddress',
          content: (
            <span>
              <AccountLink
                showOnlyAddress
                scope={token}
                address={token.eth_contract_addr ?? token.contract_addr}
                alwaysTrim
              />
              <CopyToClipboard value={token.eth_contract_addr ?? token.contract_addr} />
            </span>
          ),
        },
        {
          key: 'verification',
          content: (
            <VerificationIcon
              address_eth={token.eth_contract_addr}
              scope={token}
              verificationLevel={token.verification_level}
              hideLink
            />
          ),
        },
        {
          key: 'holdersCount',
          content:
            typeof token.num_holders === 'number' ? token.num_holders.toLocaleString() : t('common.missing'),
          align: TableCellAlign.Right,
        },
        {
          key: 'type',
          content: <TokenTypeTag tokenType={token.type} />,
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
