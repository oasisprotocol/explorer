import { EvmAbiParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'
import { FC } from 'react'
import { TFunction } from 'i18next'
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
import { TokenTransferIcon } from '../Tokens/TokenTransferIcon'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StreamIcon from '@mui/icons-material/Stream'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { MaybeEventErrorLine } from './EventError'
import {
  AccountLinkWithAddressSwitch,
  WrappedAccountLinkWithAddressSwitch,
} from '../Account/AccountLinkWithAddressSwitch'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import LanIcon from '@mui/icons-material/Lan'
import LanOutlinedIcon from '@mui/icons-material/LanOutlined'
import { MethodIcon } from '../ConsensusTransactionMethod'

const getRuntimeEventMethodLabel = (t: TFunction, method: string | undefined) => {
  switch (method) {
    case RuntimeEventType.accountstransfer:
      return t('runtimeEvent.accountstransfer')
    case RuntimeEventType.evmlog:
      return t('runtimeEvent.evmLog')
    case RuntimeEventType.coregas_used:
      return t('runtimeEvent.gasUsed')
    case RuntimeEventType.consensus_accountswithdraw:
      return t('runtimeEvent.consensusWithdrawal')
    case RuntimeEventType.consensus_accountsdeposit:
      return t('runtimeEvent.consensusDeposit')
    case RuntimeEventType.consensus_accountsdelegate:
      return t('runtimeEvent.consensusDelegate')
    case RuntimeEventType.consensus_accountsundelegate_start:
      return t('runtimeEvent.consensusUndelegateStart')
    case RuntimeEventType.consensus_accountsundelegate_done:
      return t('runtimeEvent.consensusUndelegateDone')
    case RuntimeEventType.accountsmint:
      return t('runtimeEvent.accountsmint')
    case RuntimeEventType.accountsburn:
      return t('runtimeEvent.accountsburn')
    default:
      return method || t('common.unknown')
  }
}

export const EventTypeIcon: FC<{
  eventType: RuntimeEventType
}> = ({ eventType }) => {
  const { t } = useTranslation()
  const label = getRuntimeEventMethodLabel(t, eventType)
  const props = {
    border: false,
    label,
    reverseLabel: true,
    size: 25,
  }
  const eventTypeIcons: Record<RuntimeEventType, React.ReactNode> = {
    [RuntimeEventType.accountstransfer]: <MethodIcon color="green" icon={<ArrowForwardIcon />} {...props} />,
    [RuntimeEventType.evmlog]: <></>,
    [RuntimeEventType.coregas_used]: <></>,
    [RuntimeEventType.consensus_accountswithdraw]: (
      <MethodIcon color="orange" icon={<ArrowUpwardIcon />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsdeposit]: (
      <MethodIcon color="green" icon={<ArrowDownwardIcon />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsdelegate]: <MethodIcon icon={<LanIcon />} {...props} />,
    [RuntimeEventType.consensus_accountsundelegate_start]: (
      <MethodIcon icon={<LanOutlinedIcon />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsundelegate_done]: <MethodIcon icon={<LanIcon />} {...props} />,
    [RuntimeEventType.accountsmint]: <MethodIcon color="green" icon={<StreamIcon />} {...props} />,
    [RuntimeEventType.accountsburn]: (
      <MethodIcon color="orange" icon={<LocalFireDepartmentIcon />} {...props} />
    ),
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <b>{eventTypeIcons[eventType]}</b>
    </Box>
  )
}

const EvmEventParamData: FC<{
  scope: SearchScope
  param: EvmAbiParam
  address?: string
  alwaysTrimOnTable?: boolean
}> = ({ scope, param, address, alwaysTrimOnTable }) => {
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
      return address ? (
        <AccountLink address={address} scope={scope} alwaysTrimOnTablet={alwaysTrimOnTable} />
      ) : null
    case 'uint256':
      // TODO: format with BigNumber
      return <span>{param.value as string}</span>
    default:
      return <span>{JSON.stringify(param.value, null, '  ')}</span>
  }
}

const EvmLogRow: FC<{
  scope: SearchScope
  param: EvmAbiParam
  addressSwitchOption: AddressSwitchOption
}> = ({ scope, param, addressSwitchOption }) => {
  const evmAddress = param.evm_type === 'address' ? (param.value as string) : undefined
  const oasisAddress = evmAddress ? getOasisAddress(evmAddress) : undefined
  const address = addressSwitchOption === AddressSwitchOption.Oasis ? oasisAddress : evmAddress

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
        <EvmEventParamData scope={scope} param={param} address={address} alwaysTrimOnTable />{' '}
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
  const eventName = getRuntimeEventMethodLabel(t, event.type)
  switch (event.type) {
    case RuntimeEventType.coregas_used:
      return (
        <span>
          {eventName}: {event.body.amount.toLocaleString()}
        </span>
      )
    case RuntimeEventType.evmlog: {
      const { parsedEvmLogName } = parseEvmEvent(event)
      const emittingEthAddress = `0x${Buffer.from(event.body.address, 'base64').toString('hex')}`
      const emittingOasisAddress = getOasisAddress(emittingEthAddress)
      if (!event.evm_log_name && !event.evm_log_params) {
        return (
          <div>
            <b>{eventName}</b>
            <br />
            {t('runtimeEvent.fields.topics')}:
            <Typography
              variant="mono"
              fontWeight={400}
              sx={{
                display: 'block',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
              }}
            >
              {event.body.topics
                /* @ts-expect-error -- Event body is missing types */
                .map((base64Topic, index) => {
                  return `${index}: 0x${Buffer.from(base64Topic, 'base64').toString('hex')}`
                })
                .join('\n')}
            </Typography>
            <br />
            {t('runtimeEvent.fields.data')}:
            <LongDataDisplay
              data={`0x${Buffer.from(event.body.data, 'base64').toString('hex')}`}
              fontWeight={400}
            />
            <br />
            {t('runtimeEvent.fields.emittingContract')}:
            <br />
            <WrappedAccountLinkWithAddressSwitch
              scope={scope}
              addressSwitchOption={addressSwitchOption}
              ethAddress={emittingEthAddress}
              oasisAddress={emittingOasisAddress}
            />
          </div>
        )
      }
      return (
        <div>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <b>
              <TokenTransferIcon reverseLabel method={parsedEvmLogName} size={25} />
            </b>
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
          <br />
          {t('runtimeEvent.fields.emittingContract')}:
          <br />
          <WrappedAccountLinkWithAddressSwitch
            scope={scope}
            addressSwitchOption={addressSwitchOption}
            ethAddress={emittingEthAddress}
            oasisAddress={emittingOasisAddress}
          />
        </div>
      )
    }

    case RuntimeEventType.accountsburn:
    case RuntimeEventType.accountsmint:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('runtimeEvent.fields.owner')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.owner_eth}
                oasisAddress={event.body.owner}
              />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
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
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.from_eth}
                oasisAddress={event.body.from}
              />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.to_eth}
                oasisAddress={event.body.to}
              />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount.Amount),
                ticker: event.body.amount?.Denomination,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.consensus_accountsdelegate:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.from_eth}
                oasisAddress={event.body.from}
              />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.to_eth}
                oasisAddress={event.body.to}
              />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount.Amount),
                ticker: event.body.amount.Denomination,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.consensus_accountsundelegate_start:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.from_eth}
                oasisAddress={event.body.from}
              />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.to_eth}
                oasisAddress={event.body.to}
              />
            </dd>
            <dt>{t('runtimeEvent.fields.activeShares')}</dt>
            <dd>
              {t('common.valueLong', {
                ...getPreciseNumberFormat(event.body.shares),
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.consensus_accountsundelegate_done:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.from_eth}
                oasisAddress={event.body.from}
              />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLinkWithAddressSwitch
                scope={scope}
                addressSwitchOption={addressSwitchOption}
                ethAddress={event.body.to_eth}
                oasisAddress={event.body.to}
              />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount.Amount),
                ticker: event.body.amount.Denomination,
              })}
            </dd>
            <dt>{t('runtimeEvent.fields.debondingShares')}</dt>
            <dd>
              {t('common.valueLong', {
                ...getPreciseNumberFormat(event.body.shares),
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
