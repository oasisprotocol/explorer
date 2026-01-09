import { FC } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useTokenInfo } from './hooks'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useTranslation } from 'react-i18next'
import { RuntimeScope } from '../../../types/searchScope'
import { HighlightedText } from '../../components/HighlightedText'
import { DetailsPageTitle } from '../../components/PageLayout/DetailsPageTitle'

export const TokenTitleCard: FC<{
  scope: RuntimeScope
  address: string
}> = ({ scope, address }) => {
  const { t } = useTranslation()
  const { isLoading, token } = useTokenInfo(scope, address)

  return (
    <DetailsPageTitle
      details={
        <>
          {token && (
            <>
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verificationLevel={token.verification_level}
                hideLink
              />
              &nbsp;&nbsp;&nbsp;
              <AccountLink
                scope={token}
                address={token.eth_contract_addr || token.contract_addr}
                showOnlyAddress
                alwaysTrim
              />
              <CopyToClipboard value={token.eth_contract_addr || token.contract_addr} />
            </>
          )}
        </>
      }
      isLoading={isLoading}
      title={
        <div className="flex items-center">
          {token?.name ? <HighlightedText text={token.name} /> : t('common.missing')}
          &nbsp;
          <Typography variant="large" textColor="muted" className="font-normal">
            {token?.symbol ? <HighlightedText text={token.symbol} /> : t('common.missing')}
          </Typography>
        </div>
      }
    />
  )
}
