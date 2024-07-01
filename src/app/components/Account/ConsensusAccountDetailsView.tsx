import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CardEmptyState } from '../CardEmptyState'
import { Account, Validator } from '../../../oasis-nexus/api'
import { useScreenSize } from '../../hooks/useScreensize'
import { TextSkeleton } from '../Skeleton'
import { StyledDescriptionList, StyledListTitleWithAvatar } from '../StyledDescriptionList'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { AccountAvatar } from '../AccountAvatar'
import { AccountSizeBadge } from '../AccountSizeBadge'
import { AccountLink } from './AccountLink'
import { CopyToClipboard } from '../CopyToClipboard'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { ValidatorLink } from '../Validators/ValidatorLink'

export const StyledListTitle = styled('dt')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}))

type ConsensusAccountDetailsViewProps = {
  account?: Account
  validator?: Validator
  isError?: boolean
  isLoading?: boolean
  showLayer?: boolean
  standalone?: boolean
  highlightedPartOfName?: string
}

export const ConsensusAccountDetailsView: FC<ConsensusAccountDetailsViewProps> = ({
  account,
  validator,
  isError,
  isLoading,
  showLayer,
  standalone,
  highlightedPartOfName,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

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
      {validator ? (
        <>
          <dd>
            <strong>{validator.media?.name}</strong>
            &nbsp;
            <ValidatorLink
              address={account.address}
              network={account.network}
              name={t('validator.viewProfile')}
            />
          </dd>
          <dt>{t('common.address')}</dt>
          <dd>
            <AccountLink
              scope={account}
              address={account.address}
              highlightedPartOfName={highlightedPartOfName}
            />
            <CopyToClipboard value={account.address} />
          </dd>
        </>
      ) : (
        <dd>
          <AccountLink
            scope={account}
            address={account.address}
            highlightedPartOfName={highlightedPartOfName}
          />
          <CopyToClipboard value={account.address} />
        </dd>
      )}
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
