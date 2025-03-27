import { FC } from 'react'
import { useHref, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { RoflApp, Runtime, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { useFormattedTimestampStringWithDistance } from '../../hooks/useFormattedTimestamp'
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
import { TransactionLink } from 'app/components/Transactions/TransactionLink'
import { formatDistanceStrict } from 'date-fns'
import { TeeType } from './TeeType'
import { Endorsement } from './Endorsement'

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
    'net.oasis.rofl.version': '0.0.1',
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
  last_activity_tx: {
    amount: '0',
    body: {
      address: 'PILoIUG7R8N/8ZnLU7XLRYUv93A=',
      data: 'omRib2R5pGJwa1gg9Bb4L5sipO+WuxmmdikcWUR4Lh8T2ba6krza72bsS0VkZGF0YVh8mZzkEqA2pHBTu6UWGlXmbQoa6z0DTtXsTZi2skEhv9zcOODa5XgUWWGvHb5Yg+o0qo4ydxaWGp76PQP8y14wjzeM3PaKQqrkdNOoayk2xFhkt/URZiLxo0m1knZFRk+nzRbbtojw/Lzm5m7HEUYQuD1JbdTJps1wu8HkrGVlcG9jaBmbT2Vub25jZU/rWz5FKgmBdYX7VyxDlkpmZm9ybWF0AQ==',
      value: '',
    },
    charged_fee: '3114200000000000',
    encryption_envelope: {
      data: 'mZzkEqA2pHBTu6UWGlXmbQoa6z0DTtXsTZi2skEhv9zcOODa5XgUWWGvHb5Yg+o0qo4ydxaWGp76PQP8y14wjzeM3PaKQqrkdNOoayk2xFhkt/URZiLxo0m1knZFRk+nzRbbtojw/Lzm5m7HEUYQuD1JbdTJps1wu8HkrA==',
      data_nonce: '61s+RSoJgXWF+1csQ5ZK',
      format: 'encrypted/x25519-deoxysii',
      public_key: '9Bb4L5sipO+WuxmmdikcWUR4Lh8T2ba6krza72bsS0U=',
      result: '/jNdA8a/ks4B9A9Vw5zldRHd0Ce3',
      result_nonce: 'AAAAAAB8r+4AAAAAAAAA',
    },
    eth_hash: 'bf1545be0254f163c9c3f6af4985986fc8f21a19301f0a44629191eee9c7e05c',
    fee: '202905400000000000',
    fee_symbol: 'ROSE',
    gas_limit: 2029054,
    gas_used: 31142,
    hash: 'f09e4c7bd9a99c0877fc0339da7729d6722690948c4e86c16b570bbf3a831236',
    index: 0,
    is_likely_native_token_transfer: false,
    method: 'evm.Call',
    nonce_0: 277443,
    round: 8171503,
    sender_0: 'oasis1qr5j2pugnh4u5hz4qsex6s7v80vhpjmkhcupmc2n',
    sender_0_eth: '0x5d6D0A8fF8355Eb766B8d9Cec37d8e4313166564',
    signers: [
      {
        address: 'oasis1qr5j2pugnh4u5hz4qsex6s7v80vhpjmkhcupmc2n',
        address_eth: '0x5d6D0A8fF8355Eb766B8d9Cec37d8e4313166564',
        nonce: 277443,
      },
    ],
    size: 353,
    success: true,
    timestamp: '2025-03-26T16:16:18Z',
    to: 'oasis1qqvq0zzkjj537hm47rj7lren9lma3ncumspss73n',
    to_eth: '0x3C82e82141BB47C37fF199cB53B5CB45852Ff770',
  },
  secrets: {
    foo: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2zBxzZS4buSPZWbQV8l+ZW5vbmNlTypzdpiaAo45zHiAqMst5mV2YWx1ZVTFJjKzfthesm/P4tuLPG3AsVkiIA==',
    API_KEY: 'pGJwa1ggL8WH1uN4duUVQbrxegApzlW4yXd+96ygfpYG8Qdy/DFkbmFtZVNl0HYM2z',
  },
  sek: '438B4/HJ6nmyzg0v50UxvRiBLn9ZJRa8uzDjpsD18Dw=',
  stake: '123.456789123',
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
      <SubPageCard featured title={roflApp.metadata['net.oasis.rofl.name'] || t('rofl.header')}>
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
  const formattedPolicyUpdate = useFormattedTimestampStringWithDistance(app?.policy?.update)

  if (isLoading) return <TextSkeleton numberOfRows={detailsPage ? 15 : 10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={!detailsPage}>
      <dt>{t('common.name')}</dt>
      <dd>{app.metadata['net.oasis.rofl.name'] || t('common.missing')}</dd>

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

      <dt>{t('common.status')}</dt>
      <dd>
        <RoflAppStatusBadge hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      </dd>

      <dt>{t('rofl.lastPolicyUpdate')}</dt>
      <dd>{formattedPolicyUpdate || t('common.missing')}</dd>

      <dt>{t('rofl.lastActvity')}</dt>
      <dd>
        {app.last_activity_tx ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <TransactionLink
              scope={app.last_activity_tx}
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
                      pr: 5,
                    }}
                  >
                    {key}:
                  </Typography>
                </td>
                <td>
                  <Typography variant="mono">{app.secrets[key]}</Typography>
                </td>
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
