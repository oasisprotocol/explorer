import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import {
  Validator,
  ValidatorAggStats,
  useGetConsensusValidatorsAddress,
  Account,
  useGetConsensusAccountsAddress,
} from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { getOasisAddressFromBase64PublicKey } from '../../utils/helpers'
import { RouterTabs } from '../../components/RouterTabs'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { StatusIcon } from '../../components/StatusIcon'
import { ValidatorImage } from '../../components/Validators/ValidatorImage'
import { ValidatorCommission } from '../../components/Validators/ValidatorCommission'
import { ValidatorCumulativeVoting } from '../../components/Validators/ValidatorCumulativeVoting'
import { ValidatorTitleCard } from './ValidatorTitleCard'
import { useConsensusScope } from 'app/hooks/useScopeParam'
import { AddressLoaderData } from 'app/utils/route-utils'
import { ValidatorSnapshot } from './ValidatorSnapshot'
import { SignedBlocks } from './SignedBlocks'
import { StakingTrend } from './StakingTrend'
import { ProposedBlocks } from './ProposedBlocks'
import { ValidatorDetailsContext } from './hooks'
import { debondingContainerId, delegatorsContainerId } from '../../utils/tabAnchors'
import { ValidatorStatusBadge } from './ValidatorStatusBadge'
import { PercentageValue } from '../../components/PercentageValue'
import { BalancesDiff } from '../../components/BalancesDiff'
import { RoundedBalance } from '../../components/RoundedBalance'
import { useConsensusEventTypeParam, useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { eventsContainerId } from '../../utils/tabAnchors'
import { AccountLink } from '../../components/Account/AccountLink'
import { Network } from '../../../types/network'
import { HighlightedText } from '../../components/HighlightedText'
import { AdaptiveHighlightedText } from '../../components/HighlightedText/AdaptiveHighlightedText'
import { DashboardDivider } from '../../components/Divider'
import { AdvancedField } from '../../components/AdvancedField/AdvancedField'
import { ToggleAdvancedFields } from '../../components/AdvancedField/ToggleAdvancedFields'

export const ValidatorDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useConsensusScope()
  const { txMethod, setTxMethod } = useConsensusTxMethodParam()
  const { eventType, setEventType } = useConsensusEventTypeParam()
  const { address } = useLoaderData() as AddressLoaderData
  const validatorQuery = useGetConsensusValidatorsAddress(scope.network, address)
  const { isLoading: isValidatorLoading, isFetched, data } = validatorQuery
  const validator = data?.data.validators[0]
  const stats = data?.data.stats
  const transactionsLink = useHref('')
  const eventsLink = useHref(`events#${eventsContainerId}`)
  const delegatorsLink = useHref(`delegators#${delegatorsContainerId}`)
  const debondingDelegationsLink = useHref(`debonding-delegations#${debondingContainerId}`)
  const accountQuery = useGetConsensusAccountsAddress(scope.network, address)
  const { isLoading: isAccountLoading, data: accountData } = accountQuery
  const account = accountData?.data
  const context: ValidatorDetailsContext = { scope, address, txMethod, setTxMethod, eventType, setEventType }
  const isLoading = isValidatorLoading || isAccountLoading

  return (
    <PageLayout>
      <ValidatorTitleCard isLoading={isLoading} network={scope.network} validator={validator} />
      <ValidatorSnapshot scope={scope} validator={validator} stats={stats} />
      <DashboardDivider />
      <ValidatorDetailsCard
        network={scope.network}
        isLoading={isLoading}
        validator={validator}
        account={account}
        stats={stats}
      />
      <div className="grid grid-cols-1 gap-x-6 lg:grid-cols-2">
        <div className="sm:flex">
          <StakingTrend address={address} scope={scope} />
        </div>
        <div className="sm:flex">
          <SignedBlocks isLoading={isLoading} isFetched={isFetched} signedBlocks={validator?.signed_blocks} />
        </div>
      </div>
      <AdvancedField>
        <ProposedBlocks scope={scope} validator={validator} />
      </AdvancedField>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: transactionsLink },
          { label: t('common.events'), to: eventsLink },
          { label: t('validator.delegators'), to: delegatorsLink },
          { label: t('validator.undelegations'), to: debondingDelegationsLink },
        ]}
        context={context}
      />
    </PageLayout>
  )
}

type ValidatorDetailsCardProps = {
  network: Network
  isLoading: boolean
  validator: Validator | undefined
  account: Account | undefined
  stats: ValidatorAggStats | undefined
}

const ValidatorDetailsCard: FC<ValidatorDetailsCardProps> = ({
  network,
  isLoading,
  validator,
  account,
  stats,
}) => {
  return (
    <Card variant="layout">
      <CardContent>
        <ValidatorDetailsView
          network={network}
          detailsPage
          isLoading={isLoading}
          validator={validator}
          account={account}
          stats={stats}
        />
        <ToggleAdvancedFields />
      </CardContent>
    </Card>
  )
}

export const ValidatorDetailsView: FC<{
  network: Network
  detailsPage?: boolean
  isLoading?: boolean
  validator: Validator | undefined
  account: Account | undefined
  standalone?: boolean
  stats: ValidatorAggStats | undefined
}> = ({ network, detailsPage, isLoading, validator, account, standalone = false, stats }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()
  const formattedTime = useFormattedTimestampStringWithDistance(validator?.start_date)
  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!validator) return null

  // Workaround to right-align all balance numbers
  const longestBalanceWidth = account && (
    <div className="invisible [&>*]:block [&>*]:h-0">
      <RoundedBalance value={account.total} ticker={account.ticker} />
      <RoundedBalance value={account.available} ticker={account.ticker} />
      <RoundedBalance value={account.delegations_balance} ticker={account.ticker} />
      <RoundedBalance value={account.debonding_delegations_balance} ticker={account.ticker} />
    </div>
  )

  return (
    <StyledDescriptionList
      className="grid-cols-[160px_auto] sm:grid-cols-[200px_auto]"
      standalone={standalone}
    >
      {detailsPage && (
        <>
          <dt>
            <ValidatorImage
              address={validator.entity_address}
              name={validator.media?.name}
              logotype={validator.media?.logoUrl}
            />
          </dt>
          <dd>
            <b>
              {isTablet ? (
                <AdaptiveHighlightedText text={validator.media?.name} />
              ) : (
                <HighlightedText text={validator.media?.name} />
              )}
            </b>
          </dd>
          <dt>{t('common.rank')}</dt>
          <dd>{validator.rank}</dd>
          <dt>{t('common.address')}</dt>
          <dd>
            <AccountLink scope={{ network, layer: 'consensus' }} address={validator.entity_address} />
          </dd>
          <dt>{t('account.totalBalance')}</dt>
          {account && (
            <>
              <dd>
                <div className="text-right">
                  {longestBalanceWidth}
                  <RoundedBalance value={account.total} ticker={account.ticker} />
                </div>
              </dd>
              <dt className="ml-4">{t('account.available')}</dt>
              <dd>
                <div className="text-right">
                  {longestBalanceWidth}
                  <RoundedBalance value={account.available} ticker={account.ticker} />
                </div>
              </dd>
              <dt className="ml-4">{t('common.staked')}</dt>
              <dd>
                <div className="text-right">
                  {longestBalanceWidth}
                  <RoundedBalance value={account.delegations_balance} ticker={account.ticker} />
                </div>
              </dd>
              <dt className="ml-4">{t('account.debonding')}</dt>
              <dd>
                <div className="text-right">
                  {longestBalanceWidth}
                  <RoundedBalance value={account.debonding_delegations_balance} ticker={account.ticker} />
                </div>
              </dd>
            </>
          )}
          <dt>{t('validator.delegators')}</dt>
          <dd>{validator.escrow?.num_delegators?.toLocaleString()}</dd>
          <dt>{t('common.status')}</dt>
          <dd>
            <ValidatorStatusBadge active={validator.active} inValidatorSet={validator?.in_validator_set} />
          </dd>
          {formattedTime && (
            <>
              <dt>{t('validator.startDate')}</dt>
              <dd>{formattedTime}</dd>
            </>
          )}
          {typeof validator.voting_power === 'number' && (
            <>
              <dt>{t('validator.votingPower')}</dt>
              <dd>
                {stats?.total_voting_power ? (
                  <>
                    <PercentageValue value={validator.voting_power} total={stats.total_voting_power} />
                    &nbsp; ({validator.voting_power.toLocaleString()})
                  </>
                ) : (
                  validator.voting_power.toLocaleString()
                )}
              </dd>
            </>
          )}
          <dt>{t('validator.commissionRates')}</dt>
          <dd>
            <ValidatorCommission commission={validator.current_rate} />
          </dd>

          <AdvancedField>
            <dt>{t('validator.commissionBounds')}</dt>
            <dd>
              {validator.current_commission_bound ? (
                <>
                  <ValidatorCommission commission={validator.current_commission_bound.lower} />~
                  <ValidatorCommission commission={validator.current_commission_bound.upper} />
                </>
              ) : (
                <span>{t('validator.boundsNotSet')}</span>
              )}
            </dd>
            <dt>{t('validator.entityId')}</dt>
            <dd className="font-mono">{validator.entity_id}</dd>
            <dt>{t('common.nodeId')}</dt>
            <dd className="font-mono">{validator.node_id}</dd>
            {validator.node_id && (
              <>
                <dt>{t('common.nodeAddress')}</dt>
                <dd>
                  <AccountLink
                    alwaysTrimOnTablet
                    scope={{ network, layer: 'consensus' }}
                    address={getOasisAddressFromBase64PublicKey(validator.node_id)}
                  />
                </dd>
              </>
            )}
          </AdvancedField>
        </>
      )}
      {!detailsPage && (
        <>
          <dt>{t('common.rank')}</dt>
          <dd>{validator.rank}</dd>
          <dt>{t('validator.title')}</dt>
          <dd>
            <div className="flex gap-1">
              <ValidatorImage
                address={validator.entity_address}
                name={validator.media?.name}
                logotype={validator.media?.logoUrl}
              />
              <b>{validator.media?.name}</b>
            </div>
          </dd>
          <dt>{t('validator.cumulativeVoting')}</dt>
          <dd>
            <ValidatorCumulativeVoting
              containerMarginThemeSpacing={5}
              value={validator.voting_power_cumulative}
              total={stats?.total_voting_power}
            />
          </dd>
          <dt>{t('validator.voting')}</dt>
          <dd>
            <PercentageValue
              value={validator.voting_power}
              total={stats?.total_voting_power}
              adaptMaximumFractionDigits
            />
          </dd>
          <dt>{t('common.staked')}</dt>
          <dd>
            <RoundedBalance value={validator.escrow?.active_balance} ticker={validator.ticker} />
          </dd>
          <dt>{t('validator.change')}</dt>
          <dd>
            <BalancesDiff
              before={validator.escrow.active_balance_24}
              after={validator.escrow.active_balance}
              ticker={validator.ticker}
            />
          </dd>
          <dt>{t('validator.delegators')}</dt>
          <dd>{validator.escrow?.num_delegators?.toLocaleString()}</dd>
          <dt>{t('validator.commission')}</dt>
          <dd>
            <ValidatorCommission commission={validator.current_rate} />
          </dd>
          <dt>{t('common.status')}</dt>
          <dd>
            <StatusIcon success={validator.active} error={undefined} />
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
