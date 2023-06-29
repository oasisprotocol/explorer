import { FC, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Table, TableCellAlign, TableColProps } from '../Table'
import { Layer, RuntimeEvent, useGetRuntimeEvmTokensAddress } from '../../../oasis-indexer/api'
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
import { fromBaseUnits, getEthAccountAddressFromBase64, getEvmBech32Address } from '../../utils/helpers'
import { AppErrors } from '../../../types/errors'

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

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
 * This is a wrapper around RoundedBalance which is able to find out the ticker by looking at an event
 * @constructor
 */
const DelayedEventBalance: FC<
  Omit<Exclude<Parameters<typeof RoundedBalance>[0], undefined>, 'ticker'> & {
    event: RuntimeEvent
  }
> = props => {
  const { t } = useTranslation()
  const [oasisAddress, setOasisAddress] = useState('')
  const { event, value, ...rest } = props

  if (event.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }

  const b64Address = event.body.address
  const ethAddress = b64Address ? getEthAccountAddressFromBase64(b64Address) : undefined
  useEffect(() => {
    if (ethAddress) {
      getEvmBech32Address(ethAddress).then(setOasisAddress)
    }
  }, [ethAddress])

  const tokenQuery = useGetRuntimeEvmTokensAddress(event.network, event.layer, oasisAddress, {
    query: {
      enabled: !!oasisAddress,
    },
  })

  const token = tokenQuery.data?.data
  const realValue = value === undefined ? undefined : fromBaseUnits(value, token?.decimals || 0)
  const ticker = token?.symbol || t('common.missing')

  return <RoundedBalance {...rest} value={realValue} ticker={ticker} />
}

type TokenTransfersProps = {
  transfers?: TableRuntimeEvent[]
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
  ownAddress,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'hash', content: t('common.hash') },
    { key: 'block', content: t('common.block') },
    { key: 'type', content: t('common.type'), align: TableCellAlign.Center },
    { key: 'from', content: t('common.from'), width: '150px' },
    { key: 'to', content: t('common.to'), width: '150px' },
    { key: 'value', align: TableCellAlign.Right, content: t('common.value'), width: '250px' },
  ]
  const tableRows = transfers?.map((transfer, index) => {
    const fromAddress = transfer.evm_log_params?.find(param => param.name === 'from')?.value as
      | string
      | undefined
    const toAddress = transfer.evm_log_params?.find(param => param.name === 'to')?.value as string | undefined
    const value = transfer.evm_log_params?.find(param => param.name === 'value')?.value as string | undefined
    const isMinting = fromAddress === NULL_ADDRESS
    const isBurning = toAddress === NULL_ADDRESS

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
          key: 'type',
          align: TableCellAlign.Center,
          content: (
            <TokenTransferIcon
              name={isMinting ? 'Minting' : isBurning ? 'Burning' : transfer.evm_log_name || undefined}
            />
          ),
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

        {
          key: 'value',
          align: TableCellAlign.Right,
          content: value === undefined ? '' : <DelayedEventBalance value={value} event={transfer} />,
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
    />
  )
}
