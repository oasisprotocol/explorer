import { FC } from 'react'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/card'
import { useAccount } from '../RuntimeAccountDetailsPage/hooks'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { useTranslation } from 'react-i18next'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { TokenTypeTag } from '../../components/Tokens/TokenList'
import { RuntimeScope } from '../../../types/searchScope'
import { TokenLinkWithIcon } from '../../components/Tokens/TokenLinkWithIcon'
import { EvmNft } from 'oasis-nexus/api'

type InstanceDetailsCardProps = {
  nft: EvmNft | undefined
  isFetched: boolean
  isLoading: boolean
  scope: RuntimeScope
  contractAddress: string
}

export const InstanceDetailsCard: FC<InstanceDetailsCardProps> = ({
  contractAddress,
  isFetched: isNftFetched,
  isLoading: isNftLoading,
  nft,
  scope,
}) => {
  const { t } = useTranslation()
  const {
    account,
    isFetched: isAccountFetched,
    isLoading: accountIsLoading,
  } = useAccount(scope, contractAddress)
  const token = nft?.token
  const isLoading = isNftLoading || accountIsLoading
  const isFetched = isNftFetched || isAccountFetched
  const owner = nft?.owner_eth ?? nft?.owner

  return (
    <Card variant="layout">
      <CardContent>
        {isLoading && <TextSkeleton numberOfRows={7} />}
        {isFetched && account && nft && (
          <StyledDescriptionList>
            {nft.name && (
              <>
                <dt>{t('common.name')}</dt>
                <dd>{nft.name}</dd>
              </>
            )}
            {nft.description && (
              <>
                <dt>{t('common.description')}</dt>
                <dd>
                  <div className="whitespace-pre-line">{nft.description}</div>
                </dd>
              </>
            )}
            <dt>{t('nft.instanceTokenId')}</dt>
            <dd>{nft.id}</dd>
            <dt>{t('common.collection')} </dt>
            <dd>
              <TokenLinkWithIcon scope={scope} address={contractAddress} name={token?.name} />
            </dd>
            <dt>{t('common.type')} </dt>
            <dd>
              <TokenTypeTag tokenType={token?.type} />
            </dd>
            {owner && (
              <>
                <dt>{t('nft.owner')}</dt>
                <dd>
                  <div className="inline-flex items-center">
                    <AccountLink scope={scope} address={owner} />
                    <CopyToClipboard value={owner} />
                  </div>
                </dd>
              </>
            )}
            {!!nft?.num_transfers && (
              <>
                <dt>{t('common.transfers')}</dt>
                <dd>{nft.num_transfers.toLocaleString()}</dd>
              </>
            )}
            <dt>
              <span className="sm:hidden">{t('common.smartContract_short')}</span>
              <span className="hidden sm:inline">{t('common.smartContract')}</span>
            </dt>
            <dd>
              <div className="inline-flex items-center">
                <AccountLink scope={account} address={account.address_eth || account.address} />
                <CopyToClipboard value={account.address_eth || account.address} />
              </div>
            </dd>
            <dt>{t('contract.verification.title')}</dt>
            <dd>
              <VerificationIcon
                address_eth={token?.eth_contract_addr!}
                scope={token!}
                verificationLevel={token?.verification_level}
              />
            </dd>
          </StyledDescriptionList>
        )}
      </CardContent>
    </Card>
  )
}
