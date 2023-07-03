import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { staking } from '@oasisprotocol/client'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { JazzIcon } from '../../components/JazzIcon'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { TextSkeleton } from '../../components/Skeleton'
import { EvmToken, type RuntimeAccount } from '../../../oasis-nexus/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { accountTransactionsContainerId } from '../../pages/AccountDetailsPage/AccountTransactionsCard'
import Link from '@mui/material/Link'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { getNameForTicker, Ticker } from '../../../types/ticker'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import { ContractCreatorInfo } from './ContractCreatorInfo'
import { ContractVerificationIcon } from '../ContractVerificationIcon'
import { TokenLink } from '../Tokens/TokenLink'

export const StyledAvatarContainer = styled('dt')(({ theme }) => ({
  '&&': {
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(2)} 0`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(3)} 0`,
    },
  },
}))

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

export const FiatMoneyAmountBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
}))

type AccountProps = {
  account?: RuntimeAccount
  token?: EvmToken
  isLoading: boolean
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}

export const Account: FC<AccountProps> = ({ account, token, isLoading, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const balance = account?.balances[0]?.balance
  const address = account ? account.address_eth ?? account.address : undefined

  const transactionsLabel = account ? account.stats.num_txns.toLocaleString() : ''
  const transactionsAnchor = account
    ? `${RouteUtils.getAccountRoute(
        account,
        account.address_eth ?? account.address,
      )}#${accountTransactionsContainerId}`
    : undefined

  const nativeToken = account?.ticker || Ticker.ROSE
  const nativeTickerName = getNameForTicker(t, nativeToken)
  const {
    isLoading: isPriceLoading,
    price: tokenFiatValue,
    isFree: isTokenFree,
    hasUsedCoinGecko,
  } = tokenPriceInfo
  const contract = account?.evm_contract

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
          <StyledAvatarContainer>
            <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address)} />
          </StyledAvatarContainer>
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
            {balance === undefined
              ? t('common.missing')
              : t('common.valueInToken', { value: balance, ticker: nativeTickerName })}
          </dd>

          <dt>{t('common.tokens')}</dt>
          <dd>
            <TokenPills account={account} tokens={account.evm_balances} />
          </dd>

          {!isPriceLoading && !isTokenFree && tokenFiatValue !== undefined && balance && (
            <>
              <dt>{t('common.fiatValue')}</dt>
              <dd>
                <FiatMoneyAmountBox>
                  {t('common.fiatValueInUSD', {
                    value: parseFloat(balance) * tokenFiatValue,
                    formatParams: {
                      value: {
                        currency: 'USD',
                      } satisfies Intl.NumberFormatOptions,
                    },
                  })}
                  {hasUsedCoinGecko && <CoinGeckoReferral />}
                </FiatMoneyAmountBox>
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

          <dt>{t('account.totalReceived')}</dt>
          <dd>
            {t('common.valueInToken', { value: account.stats.total_received, ticker: nativeTickerName })}
          </dd>

          <dt>{t('account.totalSent')}</dt>
          <dd>{t('common.valueInToken', { value: account.stats.total_sent, ticker: nativeTickerName })}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
