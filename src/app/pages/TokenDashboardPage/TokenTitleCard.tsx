import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { HighlightedText } from '../../components/HighlightedText'
import { TitleCard } from '../../components/PageLayout/TitleCard'

export const TokenTitleCard: FC<{ scope: SearchScope; address: string; searchTerm: string }> = ({
  scope,
  address,
  searchTerm,
}) => {
  const { t } = useTranslation()
  const { isLoading, token } = useTokenInfo(scope, address)

  return (
    <TitleCard
      details={
        <>
          {token && (
            <>
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verificationLevel={token.verification_level}
                noLink
              />
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
        <>
          {token?.name ? <HighlightedText text={token.name} pattern={searchTerm} /> : t('common.missing')}
          &nbsp;
          <Typography
            component="span"
            variant="inherit"
            sx={{
              color: COLORS.grayMedium,
            }}
          >
            {token?.symbol ? (
              <HighlightedText text={token.symbol} pattern={searchTerm} />
            ) : (
              t('common.missing')
            )}
          </Typography>
        </>
      }
    />
  )
}
