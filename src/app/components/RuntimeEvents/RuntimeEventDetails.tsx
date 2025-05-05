import { EvmAbiParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'
import { FC } from 'react'
import { TFunction } from 'i18next'
import { Trans, useTranslation } from 'react-i18next'
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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import MemoryIcon from '@mui/icons-material/Memory'
import LanIcon from '@mui/icons-material/Lan'
import LanOutlinedIcon from '@mui/icons-material/LanOutlined'
import DeveloperBoard from '@mui/icons-material/DeveloperBoard'
import DeveloperBoardOffIcon from '@mui/icons-material/DeveloperBoardOff'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { TransactionLink } from '../Transactions/TransactionLink'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { PlaceholderLabel } from '../../utils/PlaceholderLabel'
import { fromBaseUnits } from '../../utils/number-utils'

const getRuntimeEventMethodLabel = (t: TFunction, method: RuntimeEventType | undefined) => {
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
    case RuntimeEventType.roflapp_created:
      return t('runtimeEvent.roflAppCreated')
    case RuntimeEventType.roflapp_updated:
      return t('runtimeEvent.roflAppUpdated')
    case RuntimeEventType.roflapp_removed:
      return t('runtimeEvent.roflAppRemoved')
    case RuntimeEventType.roflinstance_registered:
      return t('runtimeEvent.replicaRegistered')
    case RuntimeEventType.roflmarketprovider_created:
      return t('runtimeEvent.roflmarketProviderCreated')
    case RuntimeEventType.roflmarketprovider_updated:
      return t('runtimeEvent.roflmarketProviderUpdated')
    case RuntimeEventType.roflmarketprovider_removed:
      return t('runtimeEvent.roflmarketProviderRemoved')
    case RuntimeEventType.roflmarketinstance_created:
      return t('runtimeEvent.roflmarketMachineCreated')
    case RuntimeEventType.roflmarketinstance_updated:
      return t('runtimeEvent.roflmarketMachineUpdated')
    case RuntimeEventType.roflmarketinstance_accepted:
      return t('runtimeEvent.roflmarketMachineAccepted')
    case RuntimeEventType.roflmarketinstance_cancelled:
      return t('runtimeEvent.roflmarketMachineCancelled')
    case RuntimeEventType.roflmarketinstance_removed:
      return t('runtimeEvent.roflmarketMachineRemoved')
    case RuntimeEventType.roflmarketinstance_command_queued:
      return t('runtimeEvent.roflmarketMachineCommandQueued')

    case undefined:
      return t('common.unknown')
    default:
      exhaustedTypeWarning('Unexpected event type', method)
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
    [RuntimeEventType.roflapp_created]: <MethodIcon color="green" icon={<MemoryIcon />} {...props} />,
    [RuntimeEventType.roflapp_removed]: <MethodIcon color="orange" icon={<MemoryIcon />} {...props} />,
    [RuntimeEventType.roflapp_updated]: <MethodIcon color="green" icon={<MemoryIcon />} {...props} />,
    [RuntimeEventType.roflinstance_registered]: <MethodIcon color="green" icon={<MemoryIcon />} {...props} />,
    [RuntimeEventType.roflmarketprovider_created]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketprovider_updated]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketprovider_removed]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOffIcon />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_created]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_updated]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_accepted]: <MethodIcon icon={<DeveloperBoard />} {...props} />,
    [RuntimeEventType.roflmarketinstance_cancelled]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOffIcon />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_removed]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOffIcon />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_command_queued]: <MethodIcon icon={<DeveloperBoard />} {...props} />,
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
  alwaysTrimOnTable?: boolean
}> = ({ scope, param, alwaysTrimOnTable }) => {
  const { t } = useTranslation()
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
      return param.value ? (
        <AccountLink address={param.value as string} scope={scope} alwaysTrimOnTablet={alwaysTrimOnTable} />
      ) : null
    case 'uint256': {
      if (param.evm_token?.type === 'ERC20') {
        return (
          <Tooltip
            arrow
            placement="top"
            title={t('common.valueLong', getPreciseNumberFormat(param.value_raw as string))}
            enterDelay={tooltipDelay}
            enterNextDelay={tooltipDelay}
          >
            <span>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(param.value as string),
                ticker: param.evm_token.symbol,
              })}
            </span>
          </Tooltip>
        )
      }
      if (param.evm_token?.type === 'ERC721') {
        return (
          <Trans
            t={t}
            i18nKey="common.tokenInstance"
            components={{
              InstanceLink: <PlaceholderLabel label={param.value as string} />,
              TickerLink: <PlaceholderLabel label={param.evm_token.symbol ?? t('common.missing')} />,
            }}
          />
        )
      }

      const commonEvmContractDecimals = 18
      const maybeParsedBaseUnits = fromBaseUnits(param.value as string, commonEvmContractDecimals)
      if (!maybeParsedBaseUnits.startsWith('0.0000')) {
        // Don't parse suspiciously low values.
        return (
          <Tooltip
            arrow
            placement="top"
            title={t('common.valueLong', getPreciseNumberFormat(param.value as string))}
            enterDelay={tooltipDelay}
            enterNextDelay={tooltipDelay}
          >
            <span>
              {t('common.valueLong', getPreciseNumberFormat(maybeParsedBaseUnits))}
              {`e${commonEvmContractDecimals}`}
            </span>
          </Tooltip>
        )
      }

      return (
        <span>
          {t('common.valueLong', {
            ...getPreciseNumberFormat(param.value as string),
          })}
        </span>
      )
    }
    default:
      return <span>{JSON.stringify(param.value, null, '  ')}</span>
  }
}

const EvmLogRow: FC<{
  scope: SearchScope
  param: EvmAbiParam
}> = ({ scope, param }) => {
  const clipboardValue =
    typeof param.value === 'string' ? param.value : JSON.stringify(param.value, null, '  ')

  return (
    <TableRow>
      <TableCell>{param.name}</TableCell>
      <TableCell>{param.evm_type}</TableCell>
      <TableCell>
        <EvmEventParamData scope={scope} param={param} alwaysTrimOnTable />{' '}
      </TableCell>
      <TableCell>
        <CopyToClipboard value={clipboardValue} />
      </TableCell>
    </TableRow>
  )
}

const RuntimeEventDetailsInner: FC<{
  scope: SearchScope
  event: RuntimeEvent
}> = ({ scope, event }) => {
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
      const emittingEthAddress = event.body.address
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
            <Box sx={{ display: 'inline-flex', verticalAlign: 'middle', alignItems: 'center' }}>
              {t('runtimeEvent.fields.emittingContract')}:{' '}
              <AccountLink scope={scope} alwaysTrim address={emittingEthAddress} />
            </Box>
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
                  <EvmLogRow scope={scope} key={`param-${index}`} param={param} />
                ))}
              </TableBody>
            </Table>
          )}
          <br />
          <Box sx={{ display: 'inline-flex', verticalAlign: 'middle', alignItems: 'center' }}>
            {t('runtimeEvent.fields.emittingContract')}:{' '}
            <AccountLink scope={scope} alwaysTrim address={emittingEthAddress} />
          </Box>
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
              <AccountLink scope={scope} address={event.body.owner_eth || event.body.owner} />
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
              <AccountLink scope={scope} address={event.body.from_eth || event.body.from} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.to_eth || event.body.to} />
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
              <AccountLink scope={scope} address={event.body.from_eth || event.body.from} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.to_eth || event.body.to} />
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
              <AccountLink scope={scope} address={event.body.from_eth || event.body.from} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.to_eth || event.body.to} />
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
              <AccountLink scope={scope} address={event.body.from_eth || event.body.from} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.to_eth || event.body.to} />
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
    case RuntimeEventType.roflapp_created:
    case RuntimeEventType.roflapp_removed:
    case RuntimeEventType.roflapp_updated:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.id')}</dt>
            <dd>{event.body.id}</dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.roflinstance_registered:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.id')}</dt>
            <dd>{event.body.app_id}</dd>
            {event.body?.rak?.PublicKey && (
              <>
                <dt>{t('rofl.rak')}</dt>
                <dd>
                  <Typography variant="mono">{event.body.rak.PublicKey}</Typography>
                </dd>
              </>
            )}
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.roflmarketprovider_created:
    case RuntimeEventType.roflmarketprovider_updated:
    case RuntimeEventType.roflmarketprovider_removed:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.address')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.address} />
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.roflmarketinstance_created:
    case RuntimeEventType.roflmarketinstance_updated:
    case RuntimeEventType.roflmarketinstance_accepted:
    case RuntimeEventType.roflmarketinstance_cancelled:
    case RuntimeEventType.roflmarketinstance_removed:
    case RuntimeEventType.roflmarketinstance_command_queued:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <MaybeEventErrorLine event={event} />
            <dt>{t('roflmarket.provider')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.provider} />
            </dd>
            <dt>{t('roflmarket.machineId')}</dt>
            {/* oasis-sdk serializes roflmarket provider machines id as an array */}
            <dd>{JSON.stringify(event.body.id)}</dd>
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

export const RuntimeEventDetails: FC<{
  scope: SearchScope
  event: RuntimeEvent
  showTxHash: boolean
}> = ({ scope, event, showTxHash }) => {
  const { t } = useTranslation()
  return (
    <div>
      <RuntimeEventDetailsInner scope={scope} event={event} />
      {showTxHash && event.tx_hash && (
        <p>
          {t('event.fields.emittingTransaction')}:{' '}
          <TransactionLink scope={event} alwaysTrim hash={event.eth_tx_hash || event.tx_hash} />
        </p>
      )}
    </div>
  )
}
