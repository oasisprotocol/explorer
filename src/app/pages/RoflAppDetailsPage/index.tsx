import { FC } from 'react'
import { useHref, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDistanceStrict } from 'date-fns'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Layer, RoflApp, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { AppErrors } from '../../../types/errors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
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
import { RouterTabs } from '../../components/RouterTabs'
import { instancesContainerId } from '../../utils/tabAnchors'
import { RoflAppDetailsContext } from '../RoflAppDetailsPage/hooks'
import { MetaDataCard } from './MetaDataCard'
import { PolicyCard } from './PolicyCard'

export const RoflAppDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const id = useParams().id!
  const txLink = useHref('')
  const instancesLink = useHref(`instances#${instancesContainerId}`)
  const [method, setMethod] = useTypedSearchParam('method', 'any', {
    deleteParams: ['page'],
  })
  const context: RoflAppDetailsContext = { scope, id, method, setMethod }
  const { isFetched, isLoading, data } = useGetRuntimeRoflAppsId(scope.network, Layer.sapphire, id)
  const roflApp = data?.data

  if (!roflApp && isFetched) {
    throw AppErrors.NotFoundRoflApp
  }

  return (
    <PageLayout>
      <SubPageCard
        featured
        title={
          isLoading ? <Skeleton variant="text" /> : roflApp?.metadata['net.oasis.rofl.name'] || roflApp?.id
        }
      >
        <RoflAppDetailsView detailsPage isLoading={isLoading} app={roflApp} />
      </SubPageCard>
      <Grid container spacing={4}>
        <StyledGrid item xs={12} md={6}>
          <MetaDataCard isFetched={isFetched} metadata={roflApp?.metadata} />
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          {roflApp && (
            <PolicyCard
              id={roflApp?.id}
              network={roflApp?.network}
              isFetched={isFetched}
              policy={roflApp?.policy}
            />
          )}
        </StyledGrid>
      </Grid>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          {
            label: t('rofl.instances'),
            to: instancesLink,
          },
        ]}
        context={context}
      />
    </PageLayout>
  )
}

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
