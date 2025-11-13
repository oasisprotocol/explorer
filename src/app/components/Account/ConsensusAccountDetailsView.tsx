import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../CardEmptyState'
import { Account } from '../../../oasis-nexus/api'
import { TextSkeleton } from '../Skeleton'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../StyledDescriptionList'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { AccountAvatar } from '../AccountAvatar'
import { AccountSizeBadge } from '../AccountSizeBadge'
import { ConsensusAccountLink } from './ConsensusAccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RouteUtils } from '../../utils/route-utils'
import { transactionsContainerId } from '../../utils/tabAnchors'
import { RoundedBalance } from '../RoundedBalance'
import { BalancesOnOtherLayers } from './BalancesOnOtherLayers'

type ConsensusAccountDetailsViewProps = {
  account?: Account
  isError?: boolean
  isLoading?: boolean
  showLayer?: boolean
  standalone?: boolean
  showBalancesOnOtherLayers?: boolean
}

export const ConsensusAccountDetailsView: FC<ConsensusAccountDetailsViewProps> = ({
  account,
  isError,
  isLoading,
  showLayer,
  standalone,
  showBalancesOnOtherLayers,
}) => {
  const { t } = useTranslation()
  const formattedFirstActivity = useFormattedTimestampStringWithDistance(account?.first_activity)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (isError || !account) return <CardEmptyState label={t('account.cantLoadDetails')} />

  const transactionsLabel = account.stats.num_txns.toLocaleString()
  const transactionsAnchor = account.entity
    ? `${RouteUtils.getValidatorRoute(account.network, account.entity)}#${transactionsContainerId}`
    : `${RouteUtils.getAccountRoute(account, account.address)}#${transactionsContainerId}`

  // Workaround to right-align all balance numbers
  const longestBalanceWidth = (
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
      <StyledListTitleWithAvatar>
        <div className="flex items-center gap-1">
          <AccountAvatar account={account} />
          <AccountSizeBadge size={account.size} />
        </div>
      </StyledListTitleWithAvatar>
      <dd>
        <div className="inline-flex items-center">
          <ConsensusAccountLink alwaysTrim={false} network={account.network} address={account.address} />
          <CopyToClipboard value={account.address} />
        </div>
      </dd>
      {(showLayer || showBalancesOnOtherLayers) && (
        <>
          <dt>{t('common.chain')}</dt>
          <dd className="inline!">
            <DashboardLink scope={account} />
            {showBalancesOnOtherLayers && <BalancesOnOtherLayers account={account} />}
          </dd>
        </>
      )}
      <dt>{t('account.totalBalance')}</dt>
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
      <dt>{t('common.nonce')}</dt>
      <dd>{account.nonce}</dd>
      <dt>{t('account.firstActivity')}</dt>
      <dd>
        <>{formattedFirstActivity || t('common.missing')}</>
      </dd>
      <dt>{t('common.transactions')}</dt>
      <dd>
        {account.stats.num_txns ? (
          <Link asChild className="font-medium">
            <RouterLink to={transactionsAnchor!}>{transactionsLabel}</RouterLink>
          </Link>
        ) : (
          transactionsLabel
        )}
      </dd>
    </StyledDescriptionList>
  )
}
