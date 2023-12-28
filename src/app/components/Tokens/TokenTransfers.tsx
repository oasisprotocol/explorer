import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { EvmTokenType, RuntimeEvent } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockLink } from '../Blocks/BlockLink'
import { AccountLink } from '../Account/AccountLink'
import { trimLongString } from '../../utils/trimLongString'
import Typography from '@mui/material/Typography'
import { TransactionLink } from '../Transactions/TransactionLink'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { TokenTransferIcon } from './TokenTransferIcon'
import { RoundedBalance } from '../RoundedBalance'
import { useScreenSize } from '../../hooks/useScreensize'
import { fromBaseUnits, getEthAccountAddressFromBase64 } from '../../utils/helpers'
import { TokenLink } from './TokenLink'
import { PlaceholderLabel } from '../../utils/PlaceholderLabel'
import { TokenTypeTag } from './TokenList'
import { parseEvmEvent } from '../../utils/parseEvmEvent'
import { formatDistanceToNow } from '../../utils/dateFormatter'

const iconSize = '28px'
const StyledCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: iconSize,
  height: iconSize,
  color: COLORS.eucalyptus,
  backgroundColor: COLORS.lightGreen,
  borderRadius: iconSize,
  marginLeft: theme.spacing(3),
  marginRight: `-${theme.spacing(4)}`,
}))

type TableRuntimeEvent = RuntimeEvent & {
  markAsNew?: boolean
}

/**
 * This is a wrapper around RoundedBalance which is able to display event balance properly, based on the token type
 */
export const EventBalance: FC<{
  event: RuntimeEvent
  tickerAsLink?: boolean | undefined
}> = ({ event, tickerAsLink }) => {
  const { t } = useTranslation()

  const base64address = event.body.address
  const tokenEthAddress = getEthAccountAddressFromBase64(base64address)
  const tokenType = event.evm_token?.type
  const tokenDecimals = event.evm_token?.decimals
  const ticker = event.evm_token?.symbol

  if (tokenType === EvmTokenType.ERC20) {
    // We are calling it 'raw' since it's not yet normalized according to decimals.
    const rawValue = event.evm_log_params?.find(param => param.name === 'value')?.value as string | undefined
    const value = rawValue === undefined ? undefined : fromBaseUnits(rawValue, tokenDecimals || 0)

    return (
      <RoundedBalance
        value={value}
        ticker={ticker}
        scope={event}
        tokenAddress={tokenEthAddress}
        tickerAsLink={tickerAsLink}
      />
    )
  } else if (tokenType === EvmTokenType.ERC721) {
    const tokenID = event.evm_log_params?.find(param => param.name === 'tokenID')?.value as string | undefined
    return tokenID ? (
      <Trans
        t={t}
        i18nKey="common.tokenInstance"
        components={{
          InstanceLink: <PlaceholderLabel label={tokenID} />,
          TickerLink: tickerAsLink ? (
            <TokenLink scope={event} address={tokenEthAddress} name={ticker} />
          ) : (
            <PlaceholderLabel label={ticker ?? t('common.missing')} />
          ),
        }}
      />
    ) : (
      t('common.missing')
    )
  } else {
    return tokenType
  }
}

type TokenTransfersProps = {
  transfers?: TableRuntimeEvent[]
  /**
   * Are we trying to display transfers for (potentially) multiple different tokens?
   *
   * If yes, we will show more information about each token (token type, link to token dashboard, etc.),
   * which would be redundant if we are listing transfers of a single token.
   */
  differentTokens?: boolean | undefined
  ownAddress?: string
  isLoading: boolean
  limit: number
  pagination: false | TablePaginationProps
}

export const TokenTransfers: FC<TokenTransfersProps> = ({
  isLoading,
  limit,
  pagination,
  transfers,
  differentTokens,
  ownAddress,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'hash', content: t('common.hash') },
    { key: 'block', content: t('common.block') },
    { key: 'timestamp', content: t('common.age'), align: TableCellAlign.Right },
    { key: 'type', content: t('common.type'), align: TableCellAlign.Center },
    { key: 'from', content: t('common.from'), width: '150px' },
    { key: 'to', content: t('common.to'), width: '150px' },
    ...(differentTokens
      ? [{ key: 'tokenType', content: t('tokens.type'), align: TableCellAlign.Center }]
      : []),
    { key: 'value', align: TableCellAlign.Right, content: t('common.value'), width: '250px' },
  ]
  const tableRows = transfers?.map((transfer, index) => {
    const { fromAddress, toAddress, isMinting, parsedEvmLogName } = parseEvmEvent(transfer)

    return {
      key: `event-${index + (pagination ? (pagination.selectedPage - 1) * pagination.rowsPerPage : 0)}`,
      data: [
        {
          content: (
            <TransactionLink
              scope={transfer}
              alwaysTrim={isMobile}
              hash={transfer.eth_tx_hash || transfer.tx_hash!}
            />
          ),
          key: 'hash',
        },
        {
          content: <BlockLink scope={transfer} height={transfer.round} />,
          key: 'round',
        },
        {
          align: TableCellAlign.Right,
          content: formatDistanceToNow(new Date(transfer.timestamp)),
          key: 'timestamp',
        },
        {
          key: 'type',
          align: TableCellAlign.Center,
          content: <TokenTransferIcon name={parsedEvmLogName} size={40} />,
        },

        {
          key: 'from',
          align: TableCellAlign.Right,
          content:
            isMinting || fromAddress === undefined ? (
              ''
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  pr: 3,
                }}
              >
                {!!ownAddress && fromAddress.toLowerCase() === ownAddress.toLowerCase() ? (
                  <Typography
                    variant="mono"
                    component="span"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {trimLongString(fromAddress)}
                  </Typography>
                ) : (
                  <AccountLink scope={transfer} address={fromAddress} alwaysTrim={true} />
                )}

                <StyledCircle>
                  <ArrowForwardIcon fontSize="inherit" />
                </StyledCircle>
              </Box>
            ),
        },
        {
          key: 'to',
          content: !toAddress ? (
            ''
          ) : !!ownAddress && toAddress.toLowerCase() === ownAddress.toLowerCase() ? (
            <Typography
              variant="mono"
              component="span"
              sx={{
                fontWeight: 700,
              }}
            >
              {trimLongString(toAddress)}
            </Typography>
          ) : (
            <AccountLink scope={transfer} address={toAddress} alwaysTrim={true} />
          ),
        },
        ...(differentTokens
          ? [
              {
                key: 'tokenType',
                content: transfer.evm_token ? (
                  <TokenTypeTag tokenType={transfer.evm_token.type} />
                ) : (
                  t('common.missing')
                ),
                align: TableCellAlign.Center,
              },
            ]
          : []),
        {
          key: 'value',
          align: TableCellAlign.Right,
          content: <EventBalance event={transfer} tickerAsLink={differentTokens} />,
        },
      ],
      highlight: transfer.markAsNew,
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
      alwaysWaitWhileLoading
    />
  )
}
