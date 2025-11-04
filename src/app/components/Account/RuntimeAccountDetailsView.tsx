import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { EvmToken, type RuntimeAccount } from '../../../oasis-nexus/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'
import { RouteUtils } from '../../utils/route-utils'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { AllTokenPrices } from '../../../coin-gecko/api'
import { ContractCreatorInfo } from './ContractCreatorInfo'
import { VerificationIcon } from '../ContractVerificationIcon'
import { TokenLinkWithIcon } from '../Tokens/TokenLinkWithIcon'
import { AccountAvatar } from '../AccountAvatar'
import { RuntimeBalanceDisplay } from '../Balance/RuntimeBalanceDisplay'
import { calculateFiatValue } from '../Balance/hooks'
import { FiatMoneyAmount } from '../Balance/FiatMoneyAmount'
import { getFiatCurrencyForScope, showFiatValues } from '../../../config'
import { CardEmptyState } from '../CardEmptyState'
import { extractMinimalProxyERC1167 } from '../ContractVerificationIcon/extractMinimalProxyERC1167'
import { AbiPlaygroundLink } from '../ContractVerificationIcon/AbiPlaygroundLink'
import { transactionsContainerId } from '../../utils/tabAnchors'

type RuntimeAccountDetailsViewProps = {
  isLoading?: boolean
  isError?: boolean
  account?: RuntimeAccount
  token?: EvmToken
  tokenPrices: AllTokenPrices
  showLayer?: boolean
}

export const RuntimeAccountDetailsView: FC<RuntimeAccountDetailsViewProps> = ({
  account,
  token,
  isLoading,
  isError,
  tokenPrices,
  showLayer,
}) => {
  const { t } = useTranslation()

  if (isLoading) return <TextSkeleton numberOfRows={8} />
  if (isError || !account) return <CardEmptyState label={t('account.cantLoadDetails')} />

  const address = account.address_eth ?? account.address

  const transactionsLabel = account.stats.num_txns.toLocaleString()
  const transactionsAnchor = `${RouteUtils.getAccountRoute(
    account,
    account.address_eth ?? account.address,
  )}#${transactionsContainerId}`

  const contract = account?.evm_contract
  const fiatValueInfo = calculateFiatValue(account?.balances, tokenPrices, getFiatCurrencyForScope(account))

  return (
    <StyledDescriptionList>
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
        <div className="inline-flex items-center">
          <AccountLink showOnlyAddress={!!token?.name} scope={account} address={address!} />
          <CopyToClipboard value={address!} />
        </div>
      </dd>

      {token && (
        <>
          <dt>{t('common.token')}</dt>
          <dd>
            <TokenLinkWithIcon
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
            <VerificationIcon
              address_eth={account.address_eth!}
              scope={account}
              verificationLevel={account.evm_contract?.verification?.verification_level}
            />
          </dd>
        </>
      )}

      {extractMinimalProxyERC1167(account) && (
        <>
          <dt>{t('contract.verification.proxyERC1167')}</dt>
          <dd>
            <div>
              <AccountLink scope={account} address={extractMinimalProxyERC1167(account)!} />
              <AbiPlaygroundLink scope={account} address_eth={account.address_eth!} />
            </div>
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
      <dd className="gap-2">
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
