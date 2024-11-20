import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../CardEmptyState'
import { Account } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { TextSkeleton } from '../Skeleton'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../StyledDescriptionList'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { AccountAvatar } from '../AccountAvatar'
import { AccountSizeBadge } from '../AccountSizeBadge'
import { ConsensusAccountLink } from './ConsensusAccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'

export const StyledListTitle = styled('dt')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}))

type ConsensusAccountDetailsViewProps = {
  account?: Account
  isError?: boolean
  isLoading?: boolean
  showLayer?: boolean
  standalone?: boolean
  highlightedPartOfName?: string
}

export const ConsensusAccountDetailsView: FC<ConsensusAccountDetailsViewProps> = ({
  account,
  isError,
  isLoading,
  showLayer,
  standalone,
  highlightedPartOfName,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const formattedFirstActivity = useFormattedTimestampStringWithDistance(account?.first_activity)

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (isError || !account) return <CardEmptyState label={t('account.cantLoadDetails')} />

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'} standalone={standalone}>
      {showLayer && (
        <>
          <dt>{t('common.layer')}</dt>
          <dd>
            <DashboardLink scope={account} />
          </dd>
        </>
      )}
      <StyledListTitleWithAvatar>
        <Box gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountAvatar account={account} />
          <AccountSizeBadge size={account.size} />
        </Box>
      </StyledListTitleWithAvatar>
      <dd>
        <ConsensusAccountLink
          alwaysTrim={false}
          network={account.network}
          address={account.address}
          highlightedPartOfName={highlightedPartOfName}
        />
        <CopyToClipboard value={account.address} />
      </dd>
      <dt>
        <strong>{t('account.totalBalance')}</strong>
      </dt>
      <dd>
        <strong>
          {t('common.valueInToken', {
            ...getPreciseNumberFormat(account.total),
            ticker: account.ticker,
          })}
        </strong>
      </dd>
      <StyledListTitle>{t('account.available')}</StyledListTitle>
      <dd>
        {t('common.valueInToken', {
          ...getPreciseNumberFormat(account.available),
          ticker: account.ticker,
        })}
      </dd>
      <StyledListTitle>{t('common.staked')}</StyledListTitle>
      <dd>
        {t('common.valueInToken', {
          ...getPreciseNumberFormat(account.delegations_balance!),
          ticker: account.ticker,
        })}
      </dd>
      <StyledListTitle>{t('account.debonding')}</StyledListTitle>
      <dd>
        {t('common.valueInToken', {
          ...getPreciseNumberFormat(account.debonding_delegations_balance!),
          ticker: account.ticker,
        })}
      </dd>
      <dt>{t('common.nonce')}</dt>
      <dd>{account.nonce}</dd>
      <dt>{t('account.firstActivity')}</dt>
      <dd>
        <>{formattedFirstActivity || t('common.missing')}</>
      </dd>
    </StyledDescriptionList>
  )
}
