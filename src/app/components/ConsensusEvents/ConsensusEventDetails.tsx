import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ConsensusEvent, ConsensusEventType } from '../../../oasis-nexus/api'
import { ConsensusScope } from '../../../types/searchScope'
import { TransactionLink } from '../Transactions/TransactionLink'
import { TFunction } from 'i18next'
import { exhaustedTypeWarning } from '../../../types/errors'
import { MethodIcon } from '../ConsensusTransactionMethod'
import { ArrowRight, CopyCheck, LogOut } from 'lucide-react'
import { StyledDescriptionList } from '../StyledDescriptionList'
import { AccountLink } from '../Account/AccountLink'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { getTokensForScope } from '../../../config'
import { RoundedBalance } from '../RoundedBalance'

export const getConsensusEventTypeLabel = (t: TFunction, type: ConsensusEventType | undefined): string => {
  switch (type) {
    case 'governance.proposal_executed':
      return t('consensusEvent.governanceProposalExecuted')
    case 'governance.proposal_finalized':
      return t('consensusEvent.governanceProposalFinalized')
    case 'governance.proposal_submitted':
      return t('consensusEvent.governanceProposalSubmitted')
    case 'governance.vote':
      return t('consensusEvent.governanceVote')
    case 'registry.entity':
      return t('consensusEvent.registryEntity')
    case 'registry.node':
      return t('consensusEvent.registryNode')
    case 'registry.node_unfrozen':
      return t('consensusEvent.registryNodeUnfrozen')
    case 'registry.runtime':
      return t('consensusEvent.registryRuntime')
    case 'registry.runtime_suspended':
      return t('consensusEvent.registryRuntimeSuspended')
    case 'roothash.execution_discrepancy':
      return t('consensusEvent.roothashExecution_discrepancy')
    case 'roothash.executor_committed':
      return t('consensusEvent.roothashExecutorCommitted')
    case 'roothash.finalized':
      return t('consensusEvent.roothashFinalized')
    case 'roothash.in_msg_processed':
      return t('consensusEvent.roothashInMsgProcessed')
    case 'roothash.message':
      return t('consensusEvent.roothashMessage')
    case 'staking.allowance_change':
      return t('consensusEvent.stakingAllowanceChange')
    case 'staking.burn':
      return t('consensusEvent.stakingBurn')
    case 'staking.escrow.add':
      return t('consensusEvent.stakingEscrowAdd')
    case 'staking.escrow.debonding_start':
      return t('consensusEvent.stakingEscrowDebondingStart')
    case 'staking.escrow.reclaim':
      return t('consensusEvent.stakingEscrowReclaim')
    case 'staking.escrow.take':
      return t('consensusEvent.stakingEscrowTake')
    case 'staking.transfer':
      return t('consensusEvent.stakingTransfer')
    case undefined:
      return t('common.unknown')
    default:
      exhaustedTypeWarning('Unexpected event type', type)
      return type
  }
}

const ConsensusEventDetailsContent: FC<{
  event: ConsensusEvent
}> = ({ event }) => {
  const { t } = useTranslation()
  const scope = { network: event.network, layer: 'consensus' as const }
  const ticker = getTokensForScope(scope)[0].ticker
  // TODO: Handle specific event types. Implement new UI or re-use layout used in runtimes
  switch (event.type) {
    case ConsensusEventType.stakingtransfer:
      return (
        <div>
          <b>
            <MethodIcon
              color="green"
              icon={<ArrowRight />}
              label={getConsensusEventTypeLabel(t, event.type)}
              reverseLabel
            />
          </b>
          <StyledDescriptionList>
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
                ...getPreciseNumberFormat(event.body.amount),
                ticker,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case ConsensusEventType.stakingescrowadd:
      return (
        <div>
          <b>
            <MethodIcon
              color="green"
              icon={<LogOut />}
              label={getConsensusEventTypeLabel(t, event.type)}
              reverseLabel
            />
          </b>
          <StyledDescriptionList>
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.owner} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.escrow} />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount),
                ticker,
              })}{' '}
              <span className="ml-2 text-gray-500">
                (
                <RoundedBalance
                  compactLargeNumbers
                  value={event.body.new_shares}
                  ticker={t('runtimeEvent.fields.activeShares')}
                />
                )
              </span>
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case ConsensusEventType.stakingescrowdebonding_start:
      return (
        <div>
          <b>
            <MethodIcon icon={<LogOut />} label={getConsensusEventTypeLabel(t, event.type)} reverseLabel />
          </b>
          <StyledDescriptionList>
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.owner} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.escrow} />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount),
                ticker,
              })}{' '}
              <span className="ml-2 text-gray-500">
                (
                <RoundedBalance
                  compactLargeNumbers
                  value={event.body.active_shares}
                  ticker={t('runtimeEvent.fields.activeShares')}
                />
                )
              </span>
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case ConsensusEventType.stakingescrowreclaim:
      return (
        <div>
          <b>
            <MethodIcon icon={<LogOut />} label={getConsensusEventTypeLabel(t, event.type)} reverseLabel />
          </b>
          <StyledDescriptionList>
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.owner} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.escrow} />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(event.body.amount),
                ticker,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    case ConsensusEventType.stakingallowance_change:
      return (
        <div>
          <b>
            <MethodIcon icon={<CopyCheck />} label={getConsensusEventTypeLabel(t, event.type)} reverseLabel />
          </b>
          <StyledDescriptionList>
            <dt>{t('common.from')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.owner} />
            </dd>
            <dt>{t('common.to')}</dt>
            <dd>
              <AccountLink scope={scope} address={event.body.beneficiary} />
            </dd>
            <dt>{t('runtimeEvent.fields.amount')}</dt>
            <dd>
              {t('common.valueInToken', {
                ...getPreciseNumberFormat(
                  event.body.negative ? `-${event.body.amount_change}` : `+${event.body.amount_change}`, // "+" sign is kept in getPreciseNumberFormat
                ),
                ticker,
              })}
            </dd>
          </StyledDescriptionList>
        </div>
      )
    default:
      return (
        <div>
          <b>{getConsensusEventTypeLabel(t, event.type)}</b>
          <br />
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(event, null, ' ')}</pre>
        </div>
      )
  }
}

export const ConsensusEventDetails: FC<{
  scope: ConsensusScope
  event: ConsensusEvent
  showTxHash: boolean
}> = ({ scope, event, showTxHash }) => {
  const { t } = useTranslation()
  return (
    <div>
      <ConsensusEventDetailsContent event={event} />
      {showTxHash && event.tx_hash && (
        <p>
          {t('event.fields.emittingTransaction')}:{' '}
          <TransactionLink scope={scope} alwaysTrim hash={event.tx_hash} />
        </p>
      )}
    </div>
  )
}
