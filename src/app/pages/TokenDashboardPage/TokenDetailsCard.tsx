import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import { useTokenInfo } from './hook'
import { useAccount } from '../RuntimeAccountDetailsPage/hook'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { DelayedContractCreatorInfo } from '../../components/Account/ContractCreatorInfo'
import CardContent from '@mui/material/CardContent'
import { TokenTypeTag } from '../../components/Tokens/TokenList'
import { SearchScope } from '../../../types/searchScope'
import { RouteUtils } from '../../utils/route-utils'
import { RoundedBalance } from 'app/components/RoundedBalance'
import { RuntimeBalanceDisplay } from '../../components/Balance/RuntimeBalanceDisplay'
import { extractMinimalProxyERC1167 } from '../../components/ContractVerificationIcon/extractMinimalProxyERC1167'
import { AbiPlaygroundLink } from '../../components/ContractVerificationIcon/AbiPlaygroundLink'
import Box from '@mui/material/Box'
import { holdersContainerId, tokenTransfersContainerId } from '../../utils/tabAnchors'
import { TokenLinkWithIcon } from '../../components/Tokens/TokenLinkWithIcon'

export const TokenDetailsCard: FC<{ scope: SearchScope; address: string; searchTerm: string }> = ({
  scope,
  address,
  searchTerm,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  const { token, isLoading: tokenIsLoading } = useTokenInfo(scope, address)
  const { account, isLoading: accountIsLoading } = useAccount(scope, address)
  const isLoading = tokenIsLoading || accountIsLoading

  return (
    <Card>
      <CardContent>
        {isLoading && <TextSkeleton numberOfRows={7} />}
        {!isLoading && account && token && (
          <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
            <dt>{t('common.token')}</dt>
            <dd>
              <TokenLinkWithIcon
                scope={account}
                address={token.eth_contract_addr || token.contract_addr}
                name={token.name}
                highlightedPart={searchTerm}
              />
            </dd>

            {isMobile && (
              <>
                <dt>{t('common.ticker')}</dt>
                <dd>{token.symbol}</dd>
              </>
            )}
            <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
            <dd>
              <AccountLink showOnlyAddress scope={account} address={account.address_eth || account.address} />
              <CopyToClipboard value={account.address_eth || account.address} />
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
                  <Box>
                    <AccountLink scope={account} address={extractMinimalProxyERC1167(account)!} />
                    <AbiPlaygroundLink scope={account} address_eth={account.address_eth!} />
                  </Box>
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
              <RuntimeBalanceDisplay balances={account?.balances} />
            </dd>

            <dt>{t('tokens.totalSupply')}</dt>
            <dd>
              {token.total_supply ? (
                <RoundedBalance value={token.total_supply} ticker={token?.symbol} />
              ) : (
                t('common.not_defined')
              )}
            </dd>
            <dt>{t('tokens.holders')}</dt>
            <dd>
              <Link
                component={RouterLink}
                to={`${RouteUtils.getTokenHoldersRoute(
                  scope,
                  token.eth_contract_addr,
                )}#${holdersContainerId}`}
              >
                {t('tokens.holdersValue', { value: token?.num_holders })}
              </Link>
            </dd>

            {!!token.num_transfers && (
              <>
                <dt>{t('common.transfers')}</dt>
                <dd>
                  <Link
                    component={RouterLink}
                    to={`${RouteUtils.getTokenRoute(
                      scope,
                      token.eth_contract_addr,
                    )}#${tokenTransfersContainerId}`}
                  >
                    {token.num_transfers.toLocaleString()}
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
