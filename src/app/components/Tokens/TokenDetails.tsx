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
import { RoundedBalance } from '../RoundedBalance'
import { HighlightedText } from '../HighlightedText'
import { TokenOriginLabel } from './TokenOriginLabel'

export const TokenDetails: FC<{
  isLoading?: boolean
  token: EvmToken | undefined
  showLayer?: boolean
  standalone?: boolean
  highlightedPartOfName: string | undefined
}> = ({ isLoading, token, showLayer, standalone = false, highlightedPartOfName }) => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TokenLink
            scope={token}
            address={token.eth_contract_addr ?? token.contract_addr}
            name={token.name}
            highlightedPart={highlightedPartOfName}
          />
          <Box sx={{ fontWeight: 700, color: COLORS.grayMedium, whiteSpace: 'nowrap' }}>
            <HighlightedText text={token.symbol} pattern={highlightedPartOfName} />
          </Box>
          <TokenOriginLabel label="Placeholder" />
        </Box>
      </dd>

      <dt>{t('common.type')}</dt>
      <dd>
        <TokenTypeTag tokenType={token.type} />
      </dd>

      <dt>{t(isMobile ? 'common.smartContract_short' : 'common.smartContract')}</dt>
      <dd>
        <span>
          <AccountLink
            showOnlyAddress
            scope={token}
            address={token.eth_contract_addr ?? token.contract_addr}
          />
          <CopyToClipboard value={token.eth_contract_addr ?? token.contract_addr} />
        </span>
      </dd>
      <dt>{t('contract.verification.title')}</dt>
      <dd>
        <VerificationIcon address_eth={token.eth_contract_addr} scope={token} verified={token.is_verified} />
      </dd>

      <dt>{t(isMobile ? 'tokens.holders' : 'tokens.holdersCount')}</dt>
      <dd>{token.num_holders.toLocaleString()}</dd>

      <dt>{t('tokens.totalSupply')}</dt>
      <dd>
        {token.total_supply ? (
          <RoundedBalance compactLargeNumbers value={token.total_supply} />
        ) : (
          t('common.missing')
        )}
      </dd>
    </StyledDescriptionList>
  )
}
