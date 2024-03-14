import { FC } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Account } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { useScreenSize } from '../../hooks/useScreensize'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../../components/StyledDescriptionList'
import { AccountLink } from '../../components/Account/AccountLink'
import { AccountSizeBadge } from '../../components/AccountSizeBadge'
import { TextSkeleton } from '../../components/Skeleton'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { AccountAvatar } from '../../components/AccountAvatar'
import { CardEmptyState } from '../../components/CardEmptyState'

export const StyledListTitle = styled('dt')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}))

type ConsensusAccountDetailsCardProps = {
  account: Account | undefined
  isError: boolean
  isLoading: boolean
}

export const ConsensusAccountDetailsCard: FC<ConsensusAccountDetailsCardProps> = ({
  account,
  isError,
  isLoading,
}) => {
  const { t } = useTranslation()

  return (
    <SubPageCard featured isLoadingTitle={isLoading} title={t('account.title')} mainTitle>
      <ConsensusAccountDetails isError={isError} isLoading={isLoading} account={account} />
    </SubPageCard>
  )
}

const ConsensusAccountDetails: FC<ConsensusAccountDetailsCardProps> = ({ account, isError, isLoading }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={7} />
  if (isError) return <CardEmptyState label={t('account.cantLoadDetails')} />
  if (!account) return null

  return (
    <StyledDescriptionList titleWidth={isMobile ? '160px' : '200px'}>
      <StyledListTitleWithAvatar>
        <Box gap={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountAvatar account={account} />
          <AccountSizeBadge size={account.size} />
        </Box>
      </StyledListTitleWithAvatar>
      <dd>
        <AccountLink scope={account} address={account.address} />
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
      <StyledListTitle>{t('common.staking')}</StyledListTitle>
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
      <dt>{t('account.lastNonce')}</dt>
      <dd>{account.nonce}</dd>
      <dt>{t('account.birth')}</dt>
      <dd>
        {/* TODO: provide date when it is implemented in the API */}
        <>-</>
      </dd>
    </StyledDescriptionList>
  )
}
