import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { useScreenSize } from '../../hooks/useScreensize'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { EvmToken, type RuntimeAccount } from '../../../oasis-nexus/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { accountTransactionsContainerId } from '../../pages/AccountDetailsPage/AccountTransactionsCard'
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
import { getFiatCurrencyForScope, getTokensForScope } from '../../../config'

type AccountProps = {
  account?: RuntimeAccount
  token?: EvmToken
  isLoading: boolean
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}

export const Account: FC<AccountProps> = ({ account, token, isLoading, tokenPrices, showLayer }) => {
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
            <AccountAvatar address={account.address} />
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

          {!fiatValueInfo.loading && fiatValueInfo.hasValue && (
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
