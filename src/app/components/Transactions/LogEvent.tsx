import { EvmEventParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-indexer/api'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledDescriptionList } from '../StyledDescriptionList'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { AccountLink } from '../Account/AccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { TransactionLink } from './TransactionLink'
import { SearchScope } from '../../../types/searchScope'

const EvmEventParamData: FC<{ scope: SearchScope; param: EvmEventParam }> = ({ scope, param }) => {
  /**
   * According to the API docs:
   *
   * Values of EVM type `int128`, `uint128`, `int256`, `uint256`, `fixed`, and `ufixed` are represented as strings.
   * Values of EVM type `address` and `address payable` are represented as lowercase hex strings with a "0x" prefix.
   * Values of EVM type `bytes` and `bytes<N>` are represented as base64 strings.
   * Values of other EVM types (integer types, strings, arrays, etc.) are represented as their JSON counterpart.
   */
  switch (param.evm_type) {
    // TODO: handle more EVM types
    case 'address':
      return <AccountLink scope={scope} address={param.value as string} />
    case 'uint256':
      // TODO: format with BigNumber
      return <span>{param.value as string}</span>
    default:
      return <span>{JSON.stringify(param.value, null, '  ')}</span>
  }
}

const DecodedLogEvent: FC<{ scope: SearchScope; event: RuntimeEvent }> = ({ scope, event }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const eventTypeNames: Record<RuntimeEventType, string> = {
    [RuntimeEventType.accountstransfer]: t('transactionEvent.accountstransfer'),
    [RuntimeEventType.evmlog]: t('transactionEvent.evmLog'),
    [RuntimeEventType.coregas_used]: t('transactionEvent.gasUsed'),
    [RuntimeEventType.consensus_accountswithdraw]: t('transactionEvent.consensusWithdrawal'),
    [RuntimeEventType.consensus_accountsdeposit]: t('transactionEvent.consensusDeposit'),
    [RuntimeEventType.accountsmint]: t('transactionEvent.accountsmint'),
    [RuntimeEventType.accountsburn]: t('transactionEvent.accountsburn'),
  }
  const eventName = eventTypeNames[event.type]
  switch (event.type) {
    case RuntimeEventType.coregas_used:
      return (
        <span>
          {t('common.gasUsed')}: {event.body.amount.toLocaleString()}
        </span>
      )
    case RuntimeEventType.evmlog:
      return (
        <>
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('common.type')}</dt>
            <dd>
              <b>{event.evm_log_name}</b>
            </dd>
            {event.evm_log_params && event.evm_log_params.length > 0 && (
              <>
                {/*<dt>Params</dt>*/}
                <dd>
                  <Table sx={{ border: '1px solid lightgray' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.name')}</TableCell>
                        <TableCell>{t('common.type')}</TableCell>
                        <TableCell>{t('common.data')}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {event.evm_log_params.map((param, index) => (
                        <TableRow key={`param-${index}`}>
                          <TableCell>{param.name}</TableCell>
                          <TableCell>{param.evm_type}</TableCell>
                          <TableCell>
                            <EvmEventParamData param={param} scope={scope} />{' '}
                          </TableCell>
                          <TableCell>
                            <CopyToClipboard
                              value={
                                typeof param.value === 'string'
                                  ? (param.value as string)
                                  : JSON.stringify(param.value, null, '  ')
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </dd>
              </>
            )}
          </StyledDescriptionList>
        </>
      )

    case RuntimeEventType.accountsburn:
    case RuntimeEventType.accountsmint:
    case RuntimeEventType.accountstransfer:
    case RuntimeEventType.consensus_accountsdeposit:
    case RuntimeEventType.consensus_accountswithdraw:
    default:
      return (
        <div>
          <div>{eventName}</div>
          <pre>{JSON.stringify(event, null, ' ')}</pre>
        </div>
      )
  }
}

export const TransactionLogEvent: FC<{
  scope: SearchScope
  event: RuntimeEvent
  isFirst: boolean
}> = ({ scope, event, isFirst }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const decoded = true // TODO: how do I know if this has been successfully decoded?

  // TODO: also consider tx_eth_hash when https://github.com/oasisprotocol/oasis-indexer/issues/363 is resolved

  return (
    <>
      {!isFirst && <Divider variant={'card'} />}
      <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
        {event.tx_hash && (
          <>
            <dt>{t('transaction.header')}</dt>
            <dd>
              <TransactionLink scope={scope} hash={event.tx_hash} />
            </dd>
          </>
        )}

        {decoded && (
          <>
            <dt>{t('transactionEvent.decoded')}</dt>
            <dd>
              <DecodedLogEvent scope={scope} event={event} />
            </dd>
          </>
        )}
      </StyledDescriptionList>
    </>
  )
}
