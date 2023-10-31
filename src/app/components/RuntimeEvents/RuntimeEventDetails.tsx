import { EvmEventParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledDescriptionList } from '../StyledDescriptionList'
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
import { parseEvmEvent } from '../../utils/parseEvmEvent'
import { TokenTransferIcon, TokenTransferLabel } from '../Tokens/TokenTransferIcon'
import Box from '@mui/material/Box'
import { TransferIcon } from '../CustomIcons/Transfer'
import { DepositIcon } from '../CustomIcons/Deposit'
import { WithdrawIcon } from '../CustomIcons/Withdraw'
import { COLORS } from '../../../styles/theme/colors'
import StreamIcon from '@mui/icons-material/Stream'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

export const EventTypeIcon: FC<{
  eventType: RuntimeEventType
  eventName: string
}> = ({ eventType, eventName }) => {
  const eventTypeIcons: Record<RuntimeEventType, React.ReactNode> = {
    [RuntimeEventType.accountstransfer]: <TransferIcon fontSize="inherit" />,
    [RuntimeEventType.evmlog]: <></>,
    [RuntimeEventType.coregas_used]: <></>,
    [RuntimeEventType.consensus_accountswithdraw]: <WithdrawIcon fontSize="inherit" />,
    [RuntimeEventType.consensus_accountsdeposit]: <DepositIcon fontSize="inherit" />,
    [RuntimeEventType.accountsmint]: <StreamIcon fontSize="inherit" htmlColor={COLORS.eucalyptus} />,
    [RuntimeEventType.accountsburn]: (
      <LocalFireDepartmentIcon fontSize="inherit" htmlColor={COLORS.eucalyptus} />
    ),
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <b>{eventName}</b>
      &nbsp;
      <Box component="span" sx={{ fontSize: 25, lineHeight: 0 }}>
        {eventTypeIcons[eventType]}
      </Box>
    </Box>
  )
}

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

export const RuntimeEventDetails: FC<{
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
    case RuntimeEventType.evmlog: {
      const { parsedEvmLogName } = parseEvmEvent(event)
      if (!event.evm_log_name && !event.evm_log_params) {
        return (
          <div>
            <b>{eventName}</b>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {eventName}: &nbsp;
            <b>
              <TokenTransferLabel name={parsedEvmLogName} />
            </b>
            &nbsp;
            <TokenTransferIcon name={parsedEvmLogName} size={25} />
          </Box>
          <br />
          {event.evm_log_params && event.evm_log_params.length > 0 && (
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
          )}
        </div>
      )
    }

    case RuntimeEventType.accountsburn:
    case RuntimeEventType.accountsmint:
      return (
        <div>
          <EventTypeIcon eventType={event.type} eventName={eventName} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('transactionEvent.fields.owner')}</dt>
            <dd>
              <AccountLink
                address={event.body.owner}
                scope={scope}
                plain={addressSwitchOption !== AddressSwitchOption.Oasis}
              />
              {addressSwitchOption === AddressSwitchOption.Oasis && (
                <CopyToClipboard value={event.body.owner} />
              )}
            </dd>
            <dt>{t('transactionEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount.Amount),
                ticker: event.body.amount.Denomination,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.accountstransfer:
    case RuntimeEventType.consensus_accountsdeposit:
    case RuntimeEventType.consensus_accountswithdraw:
      return (
        <div>
          <EventTypeIcon eventType={event.type} eventName={eventName} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink
                address={event.body.from}
                scope={scope}
                plain={addressSwitchOption !== AddressSwitchOption.Oasis}
              />
              {addressSwitchOption === AddressSwitchOption.Oasis && (
                <CopyToClipboard value={event.body.from} />
              )}
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink
                address={event.body.to}
                scope={scope}
                plain={addressSwitchOption !== AddressSwitchOption.Oasis}
              />
              {addressSwitchOption === AddressSwitchOption.Oasis && <CopyToClipboard value={event.body.to} />}
            </dd>
            <dt>{t('transactionEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount.Amount),
                ticker: event.body.amount.Denomination,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    default:
      exhaustedTypeWarning('Unexpected event type', event.type)
      return (
        <div>
          <b>{event.type}</b>
          <br />
          <pre>{JSON.stringify(event, null, ' ')}</pre>
        </div>
      )
  }
}
