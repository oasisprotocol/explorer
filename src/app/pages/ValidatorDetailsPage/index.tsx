import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useHref, useLoaderData } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import {
  Validator,
  ValidatorAggStats,
  useGetConsensusValidatorsAddress,
  Account,
  useGetConsensusAccountsAddress,
} from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { RouterTabs } from '../../components/RouterTabs'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { TextSkeleton } from '../../components/Skeleton'
import { StatusIcon } from '../../components/StatusIcon'
import { ValidatorImage } from '../../components/Validators/ValidatorImage'
import { ValidatorCommission } from '../../components/Validators/ValidatorCommission'
import { ValidatorCumulativeVoting } from '../../components/Validators/ValidatorCumulativeVoting'
import { ValidatorTitleCard } from './ValidatorTitleCard'
import { useRequiredScopeParam } from 'app/hooks/useScopeParam'
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
import { useConsensusTxMethodParam } from '../../hooks/useCommonParams'
import { eventsContainerId } from '../../utils/tabAnchors'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { AccountLink } from '../../components/Account/AccountLink'
import { Network } from '../../../types/network'

export const StyledListTitle = styled('dt')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}))

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}))

export const ValidatorDetailsPage: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const scope = useRequiredScopeParam()
  const { method, setMethod } = useConsensusTxMethodParam()
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
  const context: ValidatorDetailsContext = { scope, address, method, setMethod }
  const isLoading = isValidatorLoading || isAccountLoading

  return (
    <PageLayout>
      <ValidatorTitleCard isLoading={isLoading} network={scope.network} validator={validator} />
      <ValidatorSnapshot scope={scope} validator={validator} stats={stats} />
      <Divider variant="layout" sx={{ mt: isMobile ? 4 : 0 }} />
      <ValidatorDetailsCard
        network={scope.network}
        isLoading={isLoading}
        validator={validator}
        account={account}
        stats={stats}
      />
      <Grid container spacing={4}>
        <StyledGrid item xs={12} md={6}>
          <StakingTrend address={address} scope={scope} />
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          <SignedBlocks isLoading={isLoading} isFetched={isFetched} signedBlocks={validator?.signed_blocks} />
        </StyledGrid>
      </Grid>
      <ProposedBlocks scope={scope} validator={validator} />
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
    <Card>
      <CardContent>
        <ValidatorDetailsView
          network={network}
          detailsPage
          isLoading={isLoading}
          validator={validator}
          account={account}
          stats={stats}
        />
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
  const { isMobile } = useScreenSize()
  const formattedTime = useFormattedTimestampStringWithDistance(validator?.start_date)
  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!validator) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
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
            <b>{validator.media?.name}</b>
          </dd>
          <dt>{t('common.rank')}</dt>
          <dd>{validator.rank}</dd>
          <dt>{t('common.address')}</dt>
          <dd>
            <AccountLink scope={{ network, layer: 'consensus' }} address={validator.entity_address} />
          </dd>
          <dt>
            <strong>{t('account.totalBalance')}</strong>
          </dt>
          {account && (
            <>
              <dd>
                <strong>
                  {t('common.valueInToken', {
                    ...getPreciseNumberFormat(account.total),
                    ticker: account.ticker,
                  })}
                </strong>
              </dd>
              <StyledListTitle>{t('account.available')}</StyledListTitle>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(account.available),
                  ticker: account.ticker,
                })}
              </dd>
              <StyledListTitle>{t('common.staked')}</StyledListTitle>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(account.delegations_balance!),
                  ticker: account.ticker,
                })}
              </dd>
              <StyledListTitle>{t('account.debonding')}</StyledListTitle>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(account.debonding_delegations_balance!),
                  ticker: account.ticker,
                })}
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
              <dd>{validator.voting_power.toLocaleString()}</dd>
            </>
          )}
          {typeof validator.voting_power === 'number' && stats?.total_voting_power && (
            <>
              <dt>{t('validator.totalShare')}</dt>
              <dd>
                <PercentageValue value={validator.voting_power} total={stats.total_voting_power} />
              </dd>
            </>
          )}
          <dt>{t('validator.commissionRates')}</dt>
          <dd>
            <ValidatorCommission commission={validator.current_rate} />
          </dd>
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
          <dd>{validator.entity_id}</dd>
          <dt>{t('validator.nodeId')}</dt>
          <dd>{validator.node_id}</dd>
        </>
      )}
      {!detailsPage && (
        <>
          <dt>{t('common.rank')}</dt>
          <dd>{validator.rank}</dd>
          <dt>{t('validator.title')}</dt>
          <dd>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ValidatorImage
                address={validator.entity_address}
                name={validator.media?.name}
                logotype={validator.media?.logoUrl}
              />
              <b>{validator.media?.name}</b>
            </Box>
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
