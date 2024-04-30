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
              <VerificationIcon address_eth={token.eth_contract_addr} verified={token.is_verified} noLink />
              <AccountLink
                scope={token}
                address={token.eth_contract_addr || token.contract_addr}
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
            sx={{
              color: COLORS.grayMedium,
              fontSize: '24px',
              fontWeight: 700,
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
