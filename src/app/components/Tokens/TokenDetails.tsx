import { FC } from 'react'
import { EvmToken } from '../../../oasis-nexus/api'
import { TextSkeleton } from '../Skeleton'
import { StyledDescriptionList } from '../StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { TokenLink } from './TokenLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { AccountLink } from '../Account/AccountLink'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { VerificationIcon } from '../ContractVerificationIcon'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { TokenTypeTag } from './TokenList'

export const TokenDetails: FC<{
  isLoading?: boolean
  token: EvmToken | undefined
  showLayer?: boolean
  standalone?: boolean
}> = ({ isLoading, token, showLayer, standalone = false }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (!token) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={standalone}>
      {showLayer && (
        <>
          <dt>{t('common.paratime')}</dt>
          <dd>
            <DashboardLink scope={token} />
          </dd>
        </>
      )}
      <dt>{t('common.name')}</dt>
      <dd>
        <TokenLink scope={token} address={token.eth_contract_addr ?? token.contract_addr} name={token.name} />
        <Box sx={{ ml: 3, fontWeight: 700, color: COLORS.grayMedium }}>({token.symbol})</Box>
      </dd>

      <dt>{t('common.type')}</dt>
      <dd>
        <TokenTypeTag tokenType={token.type} />
      </dd>

      <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
      <dd>
        <span>
          <AccountLink scope={token} address={token.eth_contract_addr ?? token.contract_addr} />
          <CopyToClipboard value={token.eth_contract_addr ?? token.contract_addr} />
        </span>
      </dd>
      <dt>{t('contract.verification.title')}</dt>
      <dd>
        <VerificationIcon address_eth={token.eth_contract_addr} verified={token.is_verified} />
      </dd>

      <dt>{t(isMobile ? 'tokens.holdersCount_short' : 'tokens.holdersCount')}</dt>
      <dd>{token.num_holders.toLocaleString()}</dd>

      <dt>{t('tokens.totalSupply')}</dt>
      <dd>
        {token.total_supply
          ? t('tokens.totalSupplyValue', { value: token.total_supply, ticker: token.symbol })
          : t('common.missing')}
      </dd>
    </StyledDescriptionList>
  )
}
