import { useTranslation } from 'react-i18next'
import { EvmToken, EvmTokenType } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { AccountLink } from '../Account/AccountLink'
import { TokenLinkWithIcon } from './TokenLinkWithIcon'
import { CopyToClipboard } from '../CopyToClipboard'
import { VerificationIcon, verificationIconBoxHeight } from '../ContractVerificationIcon'
import Box from '@mui/material/Box'
import {
  getTokenTypeDescription,
  getTokenTypeStrictName,
  tokenBackgroundColor,
  tokenBorderColor,
} from '../../../types/tokens'
import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SxProps } from '@mui/material/styles'
import { RoundedBalance } from '../RoundedBalance'
import { useScreenSize } from 'app/hooks/useScreensize'

type TokensProps = {
  tokens?: EvmToken[]
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
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
  const { isLoading, tokens, pagination, limit } = props
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'index', content: '' },
    { key: 'name', content: t('common.name') },
    { key: 'supply', content: t('tokens.totalSupply'), align: TableCellAlign.Right },
    { key: 'ticker', content: t('common.ticker'), align: TableCellAlign.Left },
    { key: 'contract', content: t('common.smartContract') },
    {
      key: 'verification',
      content: isMobile ? t('contract.verification.sourceShort') : t('contract.verification.source'),
    },
    {
      key: 'holders',
      content: t('tokens.holders'),
      align: TableCellAlign.Right,
    },
    { key: 'type', content: t('common.type') },
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
                verificationLevel={token.verification_level}
                hideLink
                hideLabel={isMobile}
              />
            </Box>
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
          content: (
            <Box sx={{ pr: 4 }}>
              <TokenTypeTag tokenType={token.type} sx={{ width: '100%' }} />
            </Box>
          ),
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
