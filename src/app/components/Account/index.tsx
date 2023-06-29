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
import { type RuntimeAccount } from '../../../oasis-indexer/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { accountTransactionsContainerId } from '../../pages/AccountDetailsPage/AccountTransactionsCard'
import Link from '@mui/material/Link'
import { DashboardLink } from '../../pages/DashboardPage/DashboardLink'
import { getNameForTicker, Ticker } from '../../../types/ticker'
import { TokenPriceInfo } from '../../../coin-gecko/api'
import { TransactionLink } from '../Transactions/TransactionLink'
import { ContractVerificationIcon } from '../ContractVerificationIcon'

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
  isLoading: boolean
  tokenPriceInfo: TokenPriceInfo
  showLayer?: boolean
}

export const Account: FC<AccountProps> = ({ account, isLoading, tokenPriceInfo, showLayer }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const balance = account?.balances[0]?.balance ?? '0'
  const address = account ? account.address_eth ?? account.address : undefined
  const creationTxHash = account?.evm_contract?.eth_creation_tx ?? account?.evm_contract?.creation_tx

  const transactionsLabel = account ? account.stats.num_txns.toLocaleString() : ''
  const transactionsAnchor = account
    ? `${RouteUtils.getAccountRoute(
        account,
        account.address_eth ?? account.address,
      )}#${accountTransactionsContainerId}`
    : undefined

  const token = account?.ticker || Ticker.ROSE
  const tickerName = getNameForTicker(t, token)
  const {
    isLoading: isPriceLoading,
    price: tokenFiatValue,
    isFree: isTokenFree,
    hasUsedCoinGecko,
  } = tokenPriceInfo

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

          {account?.evm_contract && (
            <>
              <dt>{t('contract.verification.title')}</dt>
              <dd>
                <ContractVerificationIcon
                  verified={!!account?.evm_contract?.verification}
                  address_eth={account.address_eth!}
                />
              </dd>
            </>
          )}
          {creationTxHash && (
            <>
              <dt>{t('common.createdAt')}</dt>
              <dd>
                <TransactionLink scope={account} hash={creationTxHash} />
              </dd>
            </>
          )}

          <dt>{t('common.balance')}</dt>
          <dd>{t('common.valueInToken', { value: balance, ticker: tickerName })}</dd>

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
          <dd>{t('common.valueInToken', { value: account.stats.total_received, ticker: tickerName })}</dd>

          <dt>{t('account.totalSent')}</dt>
          <dd>{t('common.valueInToken', { value: account.stats.total_sent, ticker: tickerName })}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
