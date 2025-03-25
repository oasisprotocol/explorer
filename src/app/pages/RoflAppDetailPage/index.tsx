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
import { RoflAppStatusBadge } from '../../components/Rofl/RoflAppStatusBadge'
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

const mockedApp: RoflApp = {
  layer: 'sapphire',
  network: 'mainnet',
  ticker: 'ROSE',
  removed: false,
  num_active_instances: 3,
  date_created: '2021-04-28T16:00:00Z',
  admin: 'oasis1qpwaggvmhwq5uk40clase3knt655nn2tdy39nz2f',
  id: 'rofl1qp55evqls4qg6cjw5fnlv4al9ptc0fsakvxvd9zz',
  active_instances: [
    {
      endorsing_entity_id: '',
      endorsing_node_id: '7zI/cYuiUTPz61PL9M7f1Q/7b43nG0xk1w6yGde+msQ=',
      expiration_epoch: 1,
      extra_keys: ['A/Mag19KKuAQp2tDIxHvWIPcMzRGnhnyXWxKAbrsbWF6'],
      rak: 'nzZocZ7VWvjE1N4Z4Y/6hocqL6wW1XhLvnEruEzkq5o=',
      rek: 'ecyl1l93+l2zJ7K2oxqNtNSv8hg+pw1lKVAOfEGjzio=',
    },
  ],
  metadata: {
    'net.oasis.rofl.name': 'Sample ROFL App',
    'net.oasis.rofl.description': 'A sample ROFL application',
    'net.oasis.rofl.author': 'Oasis Protocol Foundation',
    'net.oasis.rofl.license': 'Apache-2.0',
    'net.oasis.rofl.repository': 'https://github.com/oasisprotocol/sample-rofl-app',
  },
  policy: {
    enclaves: [
      'vKzu7QwiG1MfNk3FWLFTf/9d3nzNqCB/0BQFM/knsN0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
      'oF3eJV3947jsy6hKpwdqxS6cy3/xEnIVm6cWIkdrCb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    ],
    endorsements: [{ any: {} }],
    fees: 2,
    max_expiration: 3,
    quotes: { pcs: { min_tcb_evaluation_data_number: 17, tcb_validity_period: 30, tdx: {} } },
  },
  secrets: {
    foo: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2zBxzZS4buSPZWbQV8l+ZW5vbmNlTypzdpiaAo45zHiAqMst5mV2YWx1ZVTFJjKzfthesm/P4tuLPG3AsVkiIA==',
    API_KEY: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2z',
  },
  sek: '438B4/HJ6nmyzg0v50UxvRiBLn9ZJRa8uzDjpsD18Dw=',
}

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
  const roflApp = mockedApp

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
        {t('common.missing')}
        {/* {t('common.valueInToken', {
          ...getPreciseNumberFormat(app.amount),
          ticker: app.ticker,
        })} */}
      </dd>

      <dt>{t('common.status')}</dt>
      <dd>
        <RoflAppStatusBadge status={app.status} />
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
