import { EvmEventParam, Layer, RuntimeEvent, RuntimeEventType } from '../../../oasis-indexer/api'
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

const EvmEventParamData: FC<{ layer: Layer; param: EvmEventParam }> = ({ layer, param }) => {
  switch (param.evm_type) {
    case 'address':
      return <AccountLink address={param.value as string} layer={layer} />
    case 'uint256':
      // TODO: how to properly display an uint255 value?
      return <span>{(param.value as number).toLocaleString()}</span>
    default:
      return <span>{JSON.stringify(param.value, null, '  ')}</span>
  }
}

const DecodedLogEvent: FC<{ layer: Layer; event: RuntimeEvent }> = ({ layer, event }) => {
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
      return <span>Gas used: {event.body.amount.toLocaleString()}</span>
    case RuntimeEventType.evmlog:
      return (
        <>
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('common.type')}</dt>
            <dd>
              <b>{event.evm_log_name}</b>
            </dd>
            {event.evm_log_params?.length && (
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
                            <EvmEventParamData param={param} layer={layer} />{' '}
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

export const TransactionLogEvent: FC<{ layer: Layer; event: RuntimeEvent; isFirst: boolean }> = ({
  layer,
  event,
  isFirst,
}) => {
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
              <TransactionLink layer={layer} hash={event.tx_hash} />
            </dd>
          </>
        )}

        {decoded && (
          <>
            <dt>{t('transactionEvent.decoded')}</dt>
            <dd>
              <DecodedLogEvent layer={layer} event={event} />
            </dd>
          </>
        )}
      </StyledDescriptionList>
    </>
  )
}
