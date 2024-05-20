import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { Account, EvmToken, type RuntimeAccount } from '../../../oasis-nexus/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { accountTransactionsContainerId } from '../../pages/RuntimeAccountDetailsPage/AccountTransactionsCard'
import Link from '@mui/material/Link'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { getNameForTicker } from '../../../types/ticker'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { ContractCreatorInfo } from './ContractCreatorInfo'
import { ContractVerificationIcon } from '../ContractVerificationIcon'
import { TokenLink } from '../Tokens/TokenLink'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { AccountAvatar } from '../AccountAvatar'
import { RuntimeBalanceDisplay } from '../Balance/RuntimeBalanceDisplay'
import { calculateFiatValue } from '../Balance/hooks'
import { FiatMoneyAmount } from '../Balance/FiatMoneyAmount'
import { getFiatCurrencyForScope, getTokensForScope, showFiatValues } from '../../../config'
import Box from '@mui/material/Box'
import { AccountSizeBadge } from '../AccountSizeBadge'
import { StyledListTitle } from '../../pages/ConsensusAccountDetailsPage/ConsensusAccountDetailsCard'

type RuntimeAccountDataProps = {
  account?: RuntimeAccount
  token?: EvmToken
  isLoading: boolean
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}

export const RuntimeAccountData: FC<RuntimeAccountDataProps> = ({
  account,
  token,
  isLoading,
  tokenPrices,
  showLayer,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const address = account ? account.address_eth ?? account.address : undefined

  const transactionsLabel = account ? account.stats.num_txns.toLocaleString() : ''
  const transactionsAnchor = account
    ? `${RouteUtils.getAccountRoute(
        account,
        account.address_eth ?? account.address,
      )}#${accountTransactionsContainerId}`
    : undefined

  const nativeTokens = getTokensForScope(account || { network: 'mainnet', layer: 'sapphire' })
  const nativeTickerNames = nativeTokens.map(token => getNameForTicker(t, token.ticker))
  const contract = account?.evm_contract
  const fiatValueInfo = calculateFiatValue(account?.balances, tokenPrices, getFiatCurrencyForScope(account))

  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={8} />}
      {account && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          {showLayer && (
            <>
              <dt>{t('common.paratime')}</dt>
              <dd>
                <DashboardLink scope={account} />
              </dd>
            </>
          )}
          <StyledListTitleWithAvatar>
            <AccountAvatar account={account} />
          </StyledListTitleWithAvatar>
          <dd>
            <AccountLink scope={account} address={address!} />
            <CopyToClipboard value={address!} />
          </dd>

          {token && (
            <>
              <dt>{t('common.token')}</dt>
              <dd>
                <TokenLink
                  scope={account}
                  address={token.eth_contract_addr || token.contract_addr}
                  name={token.name}
                />
              </dd>
            </>
          )}

          {contract && (
            <>
              <dt>{t('contract.verification.title')}</dt>
              <dd>
                <ContractVerificationIcon account={account} />
              </dd>
            </>
          )}

          {contract && (
            <>
              <dt>{t('contract.creator')}</dt>
              <dd>
                <ContractCreatorInfo
                  scope={account}
                  creationTxHash={contract.eth_creation_tx || contract.creation_tx}
                  alwaysTrim
                />
              </dd>
            </>
          )}

          <dt>{t('common.balance')}</dt>
          <dd>
            <RuntimeBalanceDisplay balances={account.balances} />
          </dd>

          <dt>{t('common.tokens')}</dt>
          <dd>
            <TokenPills account={account} tokens={account.evm_balances} />
          </dd>

          {showFiatValues && !fiatValueInfo.loading && fiatValueInfo.hasValue && (
            <>
              <dt>{t('common.fiatValue')}</dt>
              <dd>
                <FiatMoneyAmount {...fiatValueInfo} />
              </dd>
            </>
          )}

          <dt>{t('common.transactions')}</dt>
          <dd>
            {account.stats.num_txns ? (
              <Link component={RouterLink} to={transactionsAnchor!}>
                {transactionsLabel}
              </Link>
            ) : (
              transactionsLabel
            )}
          </dd>

          {nativeTokens.length === 1 && (
            <>
              <dt>{t('account.totalReceived')}</dt>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(account.stats.total_received),
                  ticker: nativeTickerNames[0],
                })}
              </dd>

              <dt>{t('account.totalSent')}</dt>
              <dd>
                {t('common.valueInToken', {
                  ...getPreciseNumberFormat(account.stats.total_sent),
                  ticker: nativeTickerNames[0],
                })}
              </dd>
            </>
          )}
        </StyledDescriptionList>
      )}
    </>
  )
}

export type ConsensusAccountDataProps = {
  account?: Account
  isLoading?: boolean
  showLayer?: boolean
  standalone?: boolean
}

export const ConsensusAccountData: FC<ConsensusAccountDataProps> = ({
  account,
  isLoading,
  showLayer,
  standalone,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (!account || isLoading) return <TextSkeleton numberOfRows={7} />

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
      {showLayer && (
        <>
          <dt>{t('common.layer')}</dt>
          <dd>
            <DashboardLink scope={account} />
          </dd>
        </>
      )}
      <StyledListTitleWithAvatar>
        <Box gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountAvatar account={account} />
          <AccountSizeBadge size={account.size} />
        </Box>
      </StyledListTitleWithAvatar>
      <dd>
        <AccountLink scope={account} address={account.address} />
        <CopyToClipboard value={account.address} />
      </dd>
      <dt>
        <strong>{t('account.totalBalance')}</strong>
      </dt>
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
      <StyledListTitle>{t('common.staking')}</StyledListTitle>
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
      <dt>{t('account.lastNonce')}</dt>
      <dd>{account.nonce}</dd>
      <dt>{t('account.birth')}</dt>
      <dd>
        {/* TODO: provide date when it is implemented in the API */}
        <>-</>
      </dd>
    </StyledDescriptionList>
  )
}
