import { EvmAbiParam, RuntimeEvent, RuntimeEventType } from '../../../oasis-nexus/api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyledDescriptionList } from '../StyledDescriptionList'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@oasisprotocol/ui-library/src/components/table'
import { AccountLink } from '../Account/AccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { SearchScope } from '../../../types/searchScope'
import { exhaustedTypeWarning } from '../../../types/errors'
import { LongDataDisplay } from '../LongDataDisplay'
import { parseEvmEvent } from '../../utils/parseEvmEvent'
import { TokenTransferIcon } from '../Tokens/TokenTransferIcon'
import { ArrowRight, ArrowUp, ArrowDown, Cpu, Flame, Network } from 'lucide-react'
import { DeveloperBoard } from '../MuiIcons/DeveloperBoard'
import { DeveloperBoardOff } from '../MuiIcons/DeveloperBoardOff'
import { Stream } from '../MuiIcons/Stream'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { MaybeEventErrorLine } from './EventError'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { TransactionLink } from '../Transactions/TransactionLink'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { PlaceholderLabel } from '../../utils/PlaceholderLabel'
import { fromBaseUnits } from '../../utils/number-utils'
import { RoflAppLink } from '../Rofl/RoflAppLink'
import { RoflAppInstanceLink } from '../Rofl/RoflAppInstanceLink'
import { getRuntimeEventMethodLabel } from './helpers'

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
    [RuntimeEventType.accountstransfer]: <MethodIcon color="green" icon={<ArrowRight />} {...props} />,
    [RuntimeEventType.evmlog]: <></>,
    [RuntimeEventType.coregas_used]: <></>,
    [RuntimeEventType.consensus_accountswithdraw]: (
      <MethodIcon color="orange" icon={<ArrowUp />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsdeposit]: (
      <MethodIcon color="green" icon={<ArrowDown />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsdelegate]: (
      <MethodIcon icon={<Network className="[&_rect]:fill-current" />} {...props} />
    ),
    [RuntimeEventType.consensus_accountsundelegate_start]: <MethodIcon icon={<Network />} {...props} />,
    [RuntimeEventType.consensus_accountsundelegate_done]: (
      <MethodIcon icon={<Network className="[&_rect]:fill-current" />} {...props} />
    ),
    [RuntimeEventType.accountsmint]: <MethodIcon color="green" icon={<Stream />} {...props} />,
    [RuntimeEventType.accountsburn]: <MethodIcon color="orange" icon={<Flame />} {...props} />,
    [RuntimeEventType.roflapp_created]: <MethodIcon color="green" icon={<Cpu />} {...props} />,
    [RuntimeEventType.roflapp_removed]: <MethodIcon color="orange" icon={<Cpu />} {...props} />,
    [RuntimeEventType.roflapp_updated]: <MethodIcon color="green" icon={<Cpu />} {...props} />,
    [RuntimeEventType.roflinstance_registered]: <MethodIcon color="green" icon={<Cpu />} {...props} />,
    [RuntimeEventType.roflmarketprovider_created]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketprovider_updated]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketprovider_removed]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOff />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_created]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_updated]: (
      <MethodIcon color="green" icon={<DeveloperBoard />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_accepted]: <MethodIcon icon={<DeveloperBoard />} {...props} />,
    [RuntimeEventType.roflmarketinstance_cancelled]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOff />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_removed]: (
      <MethodIcon color="orange" icon={<DeveloperBoardOff />} {...props} />
    ),
    [RuntimeEventType.roflmarketinstance_command_queued]: <MethodIcon icon={<DeveloperBoard />} {...props} />,
  }

  return (
    <div className="flex items-center">
      <b>{eventTypeIcons[eventType]}</b>
    </div>
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
          <Tooltip title={t('common.valueLong', getPreciseNumberFormat(param.value_raw as string))}>
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
          <Tooltip title={t('common.valueLong', getPreciseNumberFormat(param.value as string))}>
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
            <span className="font-mono font-medium block whitespace-pre-wrap wrap-break-word">
              {event.body.topics
                /* @ts-expect-error -- Event body is missing types */
                .map((base64Topic, index) => {
                  // \xa0 is &nbsp;
                  return `${index}:\xa00x${Buffer.from(base64Topic, 'base64').toString('hex')}`
                })
                .join('\n')}
            </span>
            <br />
            {t('runtimeEvent.fields.data')}:
            <LongDataDisplay
              data={`0x${Buffer.from(event.body.data, 'base64').toString('hex')}`}
              fontWeight={400}
            />
            <br />
            <div className="flex items-center gap-1">
              <span>{t('runtimeEvent.fields.emittingContract')}:</span>
              <AccountLink scope={scope} alwaysTrim address={emittingEthAddress} />
            </div>
          </div>
        )
      }
      return (
        <div>
          <div className="flex items-center">
            <b>
              <TokenTransferIcon reverseLabel method={parsedEvmLogName} size={25} />
            </b>
          </div>
          <br />
          {event.evm_log_params && event.evm_log_params.length > 0 && (
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('common.type')}</TableHead>
                  <TableHead>{t('common.data')}</TableHead>
                  <TableCell />
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.evm_log_params.map((param, index) => (
                  <EvmLogRow scope={scope} key={`param-${index}`} param={param} />
                ))}
              </TableBody>
            </Table>
          )}
          <br />
          <div className="flex items-center gap-1">
            <span>{t('runtimeEvent.fields.emittingContract')}:</span>
            <AccountLink scope={scope} alwaysTrim address={emittingEthAddress} />
          </div>
        </div>
      )
    }

    case RuntimeEventType.accountsburn:
    case RuntimeEventType.accountsmint:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList>
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
          <StyledDescriptionList>
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
          <StyledDescriptionList>
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
          <StyledDescriptionList>
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
          <StyledDescriptionList>
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
          <StyledDescriptionList>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.id')}</dt>
            <dd>
              <RoflAppLink id={event.body.id} network={scope.network} />
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case RuntimeEventType.roflinstance_registered:
      return (
        <div>
          <EventTypeIcon eventType={event.type} />
          <StyledDescriptionList>
            <MaybeEventErrorLine event={event} />
            <dt>{t('common.id')}</dt>
            <dd>
              <RoflAppLink id={event.body.app_id} network={scope.network} />
            </dd>
            {event.body?.rak?.PublicKey && (
              <>
                <dt>{t('rofl.rak')}</dt>
                <dd>
                  <RoflAppInstanceLink
                    id={event.body.app_id}
                    network={scope.network}
                    rak={event.body?.rak?.PublicKey}
                  />
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
          <StyledDescriptionList>
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
          <StyledDescriptionList>
            <MaybeEventErrorLine event={event} />
            <dt>{t('roflmarket.provider')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.provider} />
            </dd>
            <dt>{t('roflmarket.machineId')}</dt>
            {/* oasis-sdk serializes roflmarket provider machines id as an array */}
            <dd>0x{Buffer.from(event.body.id).toString('hex')}</dd>
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
