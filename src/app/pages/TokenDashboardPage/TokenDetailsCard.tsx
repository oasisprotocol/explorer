import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useTokenInfo } from './hooks'
import { useAccount } from '../RuntimeAccountDetailsPage/hooks'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { DelayedContractCreatorInfo } from '../../components/Account/ContractCreatorInfo'
import { TokenTypeTag } from '../../components/Tokens/TokenList'
import { RuntimeScope } from '../../../types/searchScope'
import { RouteUtils } from '../../utils/route-utils'
import { RoundedBalance } from 'app/components/RoundedBalance'
import { RuntimeBalanceDisplay } from '../../components/Balance/RuntimeBalanceDisplay'
import { extractMinimalProxyERC1167 } from '../../components/ContractVerificationIcon/extractMinimalProxyERC1167'
import { AbiPlaygroundLink } from '../../components/ContractVerificationIcon/AbiPlaygroundLink'
import { holdersContainerId, tokenTransfersContainerId } from '../../utils/tabAnchors'
import { TokenLinkWithIcon } from '../../components/Tokens/TokenLinkWithIcon'

export const TokenDetailsCard: FC<{
  scope: RuntimeScope
  address: string
}> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const { token, isLoading: tokenIsLoading } = useTokenInfo(scope, address)
  const { account, isLoading: accountIsLoading } = useAccount(scope, address)
  const isLoading = tokenIsLoading || accountIsLoading

  return (
    <Card variant="layout">
      <CardContent>
        {isLoading && <TextSkeleton numberOfRows={7} />}
        {!isLoading && account && token && (
          <StyledDescriptionList>
            <dt>{t('common.token')}</dt>
            <dd>
              <TokenLinkWithIcon
                scope={account}
                address={token.eth_contract_addr || token.contract_addr}
                name={token.name}
              />
            </dd>

            {isMobile && (
              <>
                <dt>{t('common.ticker')}</dt>
                <dd>{token.symbol}</dd>
              </>
            )}
            <dt>
              <span className="sm:hidden">{t('common.smartContract_short')}</span>
              <span className="hidden sm:inline">{t('common.smartContract')}</span>
            </dt>
            <dd>
              <div className="inline-flex items-center">
                <AccountLink
                  showOnlyAddress
                  scope={account}
                  address={account.address_eth || account.address}
                />
                <CopyToClipboard value={account.address_eth || account.address} />
              </div>
            </dd>

            <dt>{t('contract.verification.title')}</dt>
            <dd>
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verificationLevel={token.verification_level}
              />
            </dd>

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

            <dt>{t('common.type')} </dt>
            <dd>
              <TokenTypeTag tokenType={token.type} />
            </dd>

            <dt>{t('contract.creator')}</dt>
            <dd>
              <DelayedContractCreatorInfo
                scope={token}
                contractOasisAddress={token.contract_addr}
                alwaysTrim
              />
            </dd>

            <dt>{t('common.balance')} </dt>
            <dd>
              <RuntimeBalanceDisplay balances={account?.balances} scope={account} />
            </dd>

            <dt>{t('tokens.totalSupply')}</dt>
            <dd>
              {token.total_supply ? (
                <RoundedBalance value={token.total_supply} ticker={token?.symbol} />
              ) : (
                t('common.not_defined')
              )}
            </dd>

            {!!token.num_holders && (
              <>
                <dt>{t('tokens.holders')}</dt>
                <dd>
                  <Link asChild className="font-medium">
                    <RouterLink
                      to={`${RouteUtils.getTokenHoldersRoute(
                        scope,
                        token.eth_contract_addr,
                      )}#${holdersContainerId}`}
                    >
                      {t('tokens.holdersValue', { value: token.num_holders })}
                    </RouterLink>
                  </Link>
                </dd>
              </>
            )}

            {!!token.num_transfers && (
              <>
                <dt>{t('common.transfers')}</dt>
                <dd>
                  <Link asChild className="font-medium">
                    <RouterLink
                      to={`${RouteUtils.getTokenRoute(
                        scope,
                        token.eth_contract_addr,
                      )}#${tokenTransfersContainerId}`}
                    >
                      {token.num_transfers.toLocaleString()}
                    </RouterLink>
                  </Link>
                </dd>
              </>
            )}
          </StyledDescriptionList>
        )}
      </CardContent>
    </Card>
  )
}
