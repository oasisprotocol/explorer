import { FC } from 'react'
import { useHref, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { RoflApp, Runtime, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { useScreenSize } from '../../hooks/useScreensize'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTypedSearchParam } from '../../hooks/useTypedSearchParam'
import { instancesContainerId } from '../../utils/tabAnchors'
import { AppErrors } from '../../../types/errors'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { PageLayout } from '../../components/PageLayout'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { SubPageCard } from '../../components/SubPageCard'
import { AppStatus } from '../../components/Rofl/AppStatus'
import { AccountLink } from '../../components/Account/AccountLink'
import { TotalTransactionsCard } from './TotalTransactionsCard'
import { RouterTabs } from '../../components/RouterTabs'
import { MetaDataCard } from './MetaDataCard'
import { PolicyCard } from './PolicyCard'
import { InstancesCard } from './Instances'
import { RuntimeAccountDetailsContext } from '../RuntimeAccountDetailsPage'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
}))

export const RoflAppDetailPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  const id = useParams().id!
  const txLink = useHref('')
  const instancesLink = useHref(`instances#${instancesContainerId}`)
  const [method, setMethod] = useTypedSearchParam('method', 'any', {
    deleteParams: ['page'],
  })
  const context: RuntimeAccountDetailsContext = { scope, id, undefined, method, setMethod }
  const { isFetched, isLoading, data } = useGetRuntimeRoflAppsId(scope.network, scope.layer as Runtime, id)
  const roflApp = data?.data

  if (!roflApp && !isLoading) {
    throw AppErrors.NotFoundTxHash
  }

  return (
    <PageLayout>
      <SubPageCard featured title={t('rofl.header')}>
        <RoflAppDetailView detailsPage isLoading={isLoading} app={roflApp} />
      </SubPageCard>
      <Grid container spacing={4}>
        <StyledGrid item xs={12} md={6}>
          <TotalTransactionsCard />
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          <InstancesCard />
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          <MetaDataCard isFetched={isFetched} metadata={roflApp?.metadata} />
        </StyledGrid>
        <StyledGrid item xs={12} md={6}>
          <PolicyCard isFetched={isFetched} policy={roflApp?.policy} />
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

export const RoflAppDetailView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  detailsPage?: boolean
}> = ({ app, detailsPage, isLoading }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const formattedActivity = useFormattedTimestampStringWithDistance(app?.timestamp)
  const formattedPolicyUpdate = useFormattedTimestampStringWithDistance(app?.policy?.update)

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 15 : 10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={!detailsPage}>
      <dt>{t('common.name')}</dt>
      <dd>{app.metadata?.name || t('common.missing')}</dd>

      <dt>{t('rofl.version')}</dt>
      <dd>{app.version || t('common.missing')}</dd>

      <dt>{t('rofl.tee')}</dt>
      <dd>{app.tee || t('common.missing')}</dd>

      <dt>{t('rofl.appId')}</dt>
      <dd>
        {app.id} <CopyToClipboard value={app.id} />
      </dd>

      <dt>{t('rofl.enclaveId')}</dt>
      <dd>
        {app.policy?.enclaves ? (
          <table>
            {app.policy.enclaves.map(enclave => (
              <tr key={enclave}>
                <td>
                  <Typography variant="mono" component="span">
                    {enclave}
                  </Typography>
                </td>
                <td>
                  <CopyToClipboard value={enclave} />
                </td>
              </tr>
            ))}
          </table>
        ) : (
          t('common.missing')
        )}
      </dd>

      <dt>{t('rofl.kind')}</dt>
      <dd>{app.kind || t('common.missing')}</dd>

      <dt>{t('rofl.sekPublicKey')}</dt>
      <dd>
        {app.sek} <CopyToClipboard value={app.sek} />
      </dd>

      <dt>{t('rofl.adminAccount')}</dt>
      <dd>
        <AccountLink scope={{ network: app.network, layer: app.layer }} address={app.admin} />
        <CopyToClipboard value={app.admin} />
      </dd>

      <dt>{t('rofl.stakedAmount')}</dt>
      <dd>
        {t('common.valueInToken', {
          ...getPreciseNumberFormat(app.amount),
          ticker: app.ticker,
        })}
      </dd>

      <dt>{t('common.status')}</dt>
      <dd>
        <AppStatus status={app.status} />
      </dd>

      <dt>{t('rofl.lastPolicyUpdate')}</dt>
      <dd>{formattedPolicyUpdate || t('common.missing')}</dd>

      <dt>{t('rofl.activity')}</dt>
      <dd>{formattedActivity || t('common.missing')}</dd>

      <dt>{t('rofl.instances')}</dt>
      <dd>{app.instances?.length?.toLocaleString() || 0}</dd>

      <dt>{t('rofl.endorsement')}</dt>
      {/* TODO: find out what we can expect here */}
      <dd>{t('common.missing')}</dd>

      <dt>{t('rofl.Secrets')}</dt>
      <dd>
        {app.secrets ? (
          <table>
            {Object.keys(app.secrets).map(key => (
              <tr key={key}>
                <td>
                  <Typography
                    variant="mono"
                    component="span"
                    sx={{
                      wordWrap: 'break-word',
                      pr: 3,
                    }}
                  >
                    {key}:
                  </Typography>
                </td>
                <td>{app.secrets[key]}</td>
              </tr>
            ))}
          </table>
        ) : (
          t('common.missing')
        )}
      </dd>
    </StyledDescriptionList>
  )
}
