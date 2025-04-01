import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDistanceStrict } from 'date-fns'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { RoflApp } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { useScreenSize } from '../../hooks/useScreensize'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { RoflAppStatusBadge } from '../../components/Rofl/RoflAppStatusBadge'
import { RoflAppLink } from '../../components/Rofl/RoflAppLink'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { TeeType } from './TeeType'
import { Endorsement } from './Endorsement'
import { Enclaves } from './Enclaves'
import { Secrets } from './Secrets'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}))

export const RoflAppDetailsView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  detailsPage?: boolean
}> = ({ app, detailsPage, isLoading }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 15 : 10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={!detailsPage}>
      <dt>{t('common.name')}</dt>
      <dd>{app.metadata['net.oasis.rofl.name'] || t('common.missing')}</dd>

      {detailsPage && (
        <>
          <dt>{t('rofl.version')}</dt>
          <dd>{app.metadata['net.oasis.rofl.version'] || t('common.missing')}</dd>

          <dt>{t('rofl.tee')}</dt>
          <dd>
            <TeeType policy={app.policy} />
          </dd>

          <dt>{t('rofl.appId')}</dt>
          <dd>
            <Typography variant="mono" component="span">
              {app.id}
            </Typography>
            <CopyToClipboard value={app.id} />
          </dd>

          <dt>{t('rofl.enclaveId')}</dt>
          <dd>
            <Enclaves policy={app.policy} />
          </dd>

          <dt>{t('rofl.sekPublicKey')}</dt>
          <dd>
            <Typography variant="mono">{app.sek}</Typography> <CopyToClipboard value={app.sek} />
          </dd>

          <dt>{t('rofl.adminAccount')}</dt>
          <dd>
            <AccountLink scope={{ network: app.network, layer: app.layer }} address={app.admin} />
            <CopyToClipboard value={app.admin} />
          </dd>

          <dt>{t('rofl.stakedAmount')}</dt>
          <dd>
            {app.stake
              ? t('common.valueInToken', {
                  ...getPreciseNumberFormat(app.stake),
                  ticker: app.ticker,
                })
              : t('common.missing')}
          </dd>
        </>
      )}

      <dt>{t('common.status')}</dt>
      <dd>
        <RoflAppStatusBadge hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      </dd>

      {!detailsPage && (
        <>
          <dt>{t('rofl.appId')}</dt>
          <dd>
            <RoflAppLink id={app.id} network={app.network} withSourceIndicator={false} />
          </dd>
          <dt>{t('rofl.created')}</dt>
          <dd>
            {t('common.formattedDateTime', {
              value: app.date_created,
              formatParams: {
                timestamp: {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                } satisfies Intl.DateTimeFormatOptions,
              },
            })}
          </dd>
          <dt>{t('rofl.lastActivity')}</dt>
          <dd>{t('common.missing')}</dd>
        </>
      )}

      {detailsPage && (
        <>
          <dt>{t('rofl.lastActivity')}</dt>
          <dd>
            {app.last_activity_tx ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <TransactionLink
                  scope={{ network: app.network, layer: app.layer }}
                  hash={app.last_activity_tx.eth_hash || app.last_activity_tx.hash}
                />
                (
                {formatDistanceStrict(app.last_activity_tx.timestamp, new Date(), {
                  addSuffix: true,
                })}
                )
              </Box>
            ) : (
              t('common.missing')
            )}
          </dd>

          <dt>{t('rofl.instances')}</dt>
          <dd>{app.num_active_instances.toLocaleString()}</dd>

          <dt>{t('rofl.endorsement')}</dt>
          <dd>
            <Endorsement policy={app.policy} />
          </dd>

          <dt>{t('rofl.secrets')}</dt>
          <dd>
            <Secrets secrets={app.secrets} />
          </dd>
        </>
      )}
    </StyledDescriptionList>
  )
}
