import { useTranslation } from 'react-i18next'
import { EvmToken, EvmTokenType } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { TokenLink } from './TokenLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { VerificationIcon, verificationIconBoxHeight } from '../ContractVerificationIcon'
import Box from '@mui/material/Box'
import { tokenBackgroundColor, tokenBorderColor } from '../../../types/tokens'
import { getTokenMarketCap, getTokenTypeDescription, getTokenTypeStrictName } from '../../utils/tokens'
import { SearchScope } from '../../../types/searchScope'
import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SxProps } from '@mui/material/styles'
import { RoundedBalance } from '../RoundedBalance'
import { useTokenPrice } from '../../../coin-gecko/api'
import { Ticker } from '../../../types/ticker'
import { FiatValue } from '../FiatValue'
import { MarketCapTitle } from './MarketCapTitle'
import { Network } from 'types/network'
import { TokenOriginLabel } from './TokenOriginLabel'

type TokensProps = {
  tokens?: EvmToken[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
  scope: SearchScope
}

export const TokenTypeTag: FC<{ tokenType: EvmTokenType | undefined; sx?: SxProps }> = ({
  tokenType,
  sx = {},
}) => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        background: tokenBackgroundColor[tokenType ?? 'missing'],
        border: `1px solid ${tokenBorderColor[tokenType ?? 'missing']}`,
        display: 'inline-block',
        borderRadius: 2,
        py: 1,
        px: 3,
        fontSize: 12,
        height: verificationIconBoxHeight,
        verticalAlign: 'middle',
        textAlign: 'center',
        ...sx,
      }}
    >
      <Typography component="span">{getTokenTypeDescription(t, tokenType)}</Typography>
      &nbsp;
      <Typography component="span" color={COLORS.grayMedium}>
        {t('common.parentheses', { subject: getTokenTypeStrictName(t, tokenType ?? 'missing') })}
      </Typography>
    </Box>
  )
}

export const TokenList = (props: TokensProps) => {
  const { isLoading, tokens, pagination, limit, scope } = props
  const { t } = useTranslation()
  const priceQuery = useTokenPrice(Ticker.ROSE, 'usd')
  const tableColumns: TableColProps[] = [
    { key: 'index', content: '#' },
    { key: 'name', content: t('common.name') },
    { key: 'type', content: t('common.type') },
    { key: 'contract', content: t('common.smartContract') },
    { key: 'verification', content: t('contract.verification.title') },
    ...(scope.network === Network.mainnet
      ? [
          {
            align: TableCellAlign.Right,
            key: 'marketCap',
            content: (
              <Box sx={{ display: 'inline-flex', gap: 2 }}>
                <MarketCapTitle scope={props.scope} />
              </Box>
            ),
          },
        ]
      : []),
    {
      key: 'holders',
      content: t('tokens.holders'),
      align: TableCellAlign.Right,
    },
    { key: 'supply', content: t('tokens.totalSupply'), align: TableCellAlign.Right },
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TokenLink
                scope={token}
                address={token.eth_contract_addr ?? token.contract_addr}
                name={token.name}
              />
              <TokenOriginLabel label="Placeholder" />
            </Box>
          ),
          key: 'name',
        },
        {
          key: 'type',
          content: (
            <Box sx={{ pr: 4 }}>
              <TokenTypeTag tokenType={token.type} sx={{ width: '100%' }} />
            </Box>
          ),
        },
        {
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
          key: 'contactAddress',
        },
        {
          key: 'verification',
          content: (
            <Box
              sx={{
                display: 'inline-flex',
                verticalAlign: 'middle',
                width: '100%',
              }}
            >
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verified={token.is_verified}
                noLink
              />
            </Box>
          ),
        },
        ...(scope.network === Network.mainnet
          ? [
              {
                content: (
                  <FiatValue
                    isLoading={priceQuery.isLoading}
                    value={getTokenMarketCap(token?.relative_total_value, priceQuery.price)}
                  />
                ),
                key: 'marketCap',
                align: TableCellAlign.Right,
              },
            ]
          : []),
        {
          content: token.num_holders.toLocaleString(),
          key: 'holdersCount',
          align: TableCellAlign.Right,
        },
        {
          content: <RoundedBalance compactLargeNumbers value={token.total_supply} ticker={token.symbol} />,
          key: 'supply',
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
