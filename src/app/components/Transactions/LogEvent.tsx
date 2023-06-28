import { EvmEventParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledDescriptionList } from '../StyledDescriptionList'
import Divider from '@mui/material/Divider'
import { useScreenSize } from '../../hooks/useScreensize'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { AccountLink } from '../Account/AccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { SearchScope } from '../../../types/searchScope'
import { AddressSwitchOption } from '../AddressSwitch'
import { getOasisAddress } from '../../utils/helpers'
import { exhaustedTypeWarning } from '../../../types/errors'
import { LongDataDisplay } from '../LongDataDisplay'

const EvmEventParamData: FC<{
  scope: SearchScope
  param: EvmEventParam
  address?: string
}> = ({ scope, param, address }) => {
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
      return address ? <AccountLink address={address} scope={scope} /> : null
    case 'uint256':
      // TODO: format with BigNumber
      return <span>{param.value as string}</span>
    default:
      return <span>{JSON.stringify(param.value, null, '  ')}</span>
  }
}

const EvmLogRow: FC<{
  scope: SearchScope
  param: EvmEventParam
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, param, addressSwitchOption }) => {
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    if (param.evm_type !== 'address') {
      return
    }

    const resolveAddresses = async () => {
      if (addressSwitchOption === AddressSwitchOption.Oasis) {
        const oasisAddress = await getOasisAddress(param.value as string)
        setAddress(oasisAddress)
      } else {
        setAddress(param.value as string)
      }
    }

    resolveAddresses()
  }, [param, addressSwitchOption])

  const getCopyToClipboardValue = () => {
    if (address) {
      return address
    }

    return typeof param.value === 'string' ? (param.value as string) : JSON.stringify(param.value, null, '  ')
  }

  return (
    <TableRow>
      <TableCell>{param.name}</TableCell>
      <TableCell>{param.evm_type}</TableCell>
      <TableCell>
        <EvmEventParamData scope={scope} param={param} address={address} />{' '}
      </TableCell>
      <TableCell>
        <CopyToClipboard value={getCopyToClipboardValue()} />
      </TableCell>
    </TableRow>
  )
}

const DecodedLogEvent: FC<{
  scope: SearchScope
  event: RuntimeEvent
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, event, addressSwitchOption }) => {
  const { isMobile } = useScreenSize()
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
          {eventName}: {event.body.amount.toLocaleString()}
        </span>
      )
    case RuntimeEventType.evmlog:
      if (!event.evm_log_name && !event.evm_log_params && event.body.data) {
        return (
          <div>
            <div>{eventName}</div>
            <br />
            <LongDataDisplay
              data={`0x${Buffer.from(event.body.data, 'base64').toString('hex')}`}
              threshold={300}
              fontWeight={400}
            />
          </div>
        )
      }
      return (
        <div>
          <div>{eventName}</div>
          <br />

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
                        <EvmLogRow
                          scope={scope}
                          key={`param-${index}`}
                          param={param}
                          addressSwitchOption={addressSwitchOption}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </dd>
              </>
            )}
          </StyledDescriptionList>
        </div>
      )

    case RuntimeEventType.accountsburn:
    case RuntimeEventType.accountsmint:
    case RuntimeEventType.accountstransfer:
    case RuntimeEventType.consensus_accountsdeposit:
    case RuntimeEventType.consensus_accountswithdraw:
      return (
        <div>
          <div>{eventName}</div>
          <pre>{JSON.stringify(event, null, ' ')}</pre>
        </div>
      )
    default:
      exhaustedTypeWarning('Unexpected event type', event.type)
      return (
        <div>
          <div>{eventName}</div>
          <br />
          <pre>{JSON.stringify(event, null, ' ')}</pre>
        </div>
      )
  }
}

export const TransactionLogEvent: FC<{
  scope: SearchScope
  event: RuntimeEvent
  isFirst: boolean
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, event, isFirst, addressSwitchOption }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const decoded = true // TODO: how do I know if this has been successfully decoded?

  return (
    <>
      {!isFirst && <Divider variant="card" />}
      <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
        {decoded && (
          <>
            <dt>{t('transactionEvent.decoded')}</dt>
            <dd>
              <DecodedLogEvent scope={scope} event={event} addressSwitchOption={addressSwitchOption} />
            </dd>
          </>
        )}
      </StyledDescriptionList>
    </>
  )
}
