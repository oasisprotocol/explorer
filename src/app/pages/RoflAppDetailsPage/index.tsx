import { FC, ReactNode } from 'react'
import { useHref, useLoaderData } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'
import { RoflApp, RoflAppPolicy, RuntimeTransaction, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { AppErrors } from '../../../types/errors'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { COLORS } from '../../../styles/theme/colors'
import { useScreenSize } from '../../hooks/useScreensize'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { TextSkeleton } from '../../components/Skeleton'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { RoflAppStatusBadge } from '../../components/Rofl/RoflAppStatusBadge'
import { RoflAppLink } from '../../components/Rofl/RoflAppLink'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TeeType } from './TeeType'
import { Endorsement } from './Endorsement'
import { Enclaves } from './Enclaves'
import { Secrets } from './Secrets'
import { RouterTabs } from '../../components/RouterTabs'
import { TableCellAge } from '../../components/TableCellAge'
import { instancesContainerId, updatesContainerId } from '../../utils/tabAnchors'
import { RoflAppDetailsContext } from './hooks'
import { MetaDataCard } from './MetaDataCard'
import { PolicyCard } from './PolicyCard'
import { LastActivity } from './LastActivity'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { SearchScope } from 'types/searchScope'
import { Ticker } from 'types/ticker'
import { WithHoverHighlighting } from '../../components/HoverHighlightingContext/WithHoverHighlighting'
import { HighlightedText, HighlightPattern } from '../../components/HighlightedText'
import { RoflAppLoaderData } from '../../utils/route-utils'
import { getHighlightPattern, textSearch } from '../../components/Search/search-utils'

export const RoflAppDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()
  const { id, searchQuery } = useLoaderData() as RoflAppLoaderData
  const highlightPattern = getHighlightPattern(textSearch.roflAppName(searchQuery))
  const txLink = useHref('')
  const updatesLink = useHref(`updates#${updatesContainerId}`)
  const instancesLink = useHref(`instances#${instancesContainerId}`)
  const { txMethod, setTxMethod } = useRuntimeTxMethodParam()
  const context: RoflAppDetailsContext = { scope, id, txMethod, setTxMethod }
  const { isFetched, isLoading, data } = useGetRuntimeRoflAppsId(scope.network, scope.layer, id)
  const roflApp = data?.data

  if (!roflApp && isFetched) {
    throw AppErrors.NotFoundRoflApp
  }

  return (
    <PageLayout>
      <SubPageCard
        featured
        title={
          isLoading ? (
            <Skeleton className="h-4" />
          ) : (
            roflApp && (
              <RoflAppLink
                id={roflApp.id}
                network={scope.network}
                name={roflApp.metadata['net.oasis.rofl.name']}
                highlightPattern={highlightPattern}
                labelOnly
                trimMode={'adaptive'}
                withSourceIndicator={false}
              />
            )
          )
        }
      >
        <RoflAppDetailsView isLoading={isLoading} app={roflApp} highlightPattern={highlightPattern} />
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
              layer={roflApp?.layer}
              isFetched={isFetched}
              policy={roflApp?.policy}
            />
          )}
        </StyledGrid>
      </Grid>
      <RouterTabs
        tabs={[
          { label: t('common.transactions'), to: txLink },
          { label: t('rofl.updates'), to: updatesLink },
          {
            label: t('rofl.replicas'),
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
  highlightPattern?: HighlightPattern
}> = ({ app, isLoading, highlightPattern }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={15} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
      <NameRow name={app.metadata['net.oasis.rofl.name']} highlightPattern={highlightPattern} />
      <VersionRow version={app.metadata['net.oasis.rofl.version']} />
      <TeeRow policy={app.policy} />
      <DetailsRow title={t('rofl.appId')}>
        <WithHoverHighlighting address={app.id}>
          <Typography variant="mono" component="span">
            {app.id}
          </Typography>
        </WithHoverHighlighting>
        <CopyToClipboard value={app.id} />
      </DetailsRow>
      <DetailsRow title={t('rofl.enclaveId')}>
        <Enclaves policy={app.policy} />
      </DetailsRow>
      <DetailsRow title={t('rofl.sekPublicKey')}>
        <Typography variant="mono">{app.sek}</Typography> <CopyToClipboard value={app.sek} />
      </DetailsRow>
      <AdminAccountRow
        address={app.admin_eth ?? app.admin}
        scope={{ network: app.network, layer: app.layer }}
      />
      <StakedAmountRow stake={app.stake} ticker={app.ticker} />
      <StatusBadgeRow hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      <ActiveInstancesNumberRow number={app.num_active_instances} />
      <LastActivityRow
        scope={{ network: app.network, layer: app.layer }}
        transaction={app.last_activity_tx}
      />
      <DetailsRow title={t('rofl.endorsement')}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Endorsement
            endorsements={app.policy.endorsements}
            groupOp={'or'} // We have an implicit default "or" for toplevel endorsement
          />
        </Box>
      </DetailsRow>
      <DetailsRow
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {t('rofl.secrets')}
            <Tooltip title={t('rofl.secretsTooltip')} placement="top">
              <InfoIcon htmlColor={COLORS.brandDark} fontSize="small" />
            </Tooltip>
          </Box>
        }
      >
        <Secrets secrets={app.secrets} />
      </DetailsRow>
    </StyledDescriptionList>
  )
}

export const RoflAppDetailsViewSearchResult: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  highlightPattern?: HighlightPattern
}> = ({ app, isLoading, highlightPattern }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
      <DetailsRow title={t('common.paratime')}>
        <DashboardLink scope={{ network: app.network, layer: app.layer }} />
      </DetailsRow>
      <NameRow name={app.metadata['net.oasis.rofl.name']} highlightPattern={highlightPattern} />
      <VersionRow version={app.metadata['net.oasis.rofl.version']} />
      <TeeRow policy={app.policy} />
      <DetailsRow title={t('rofl.appId')}>
        <RoflAppLink
          id={app.id}
          name={app.id}
          network={app.network}
          highlightPattern={highlightPattern}
          withSourceIndicator={false}
        />
        <CopyToClipboard value={app.id} />
      </DetailsRow>
      <AdminAccountRow
        address={app.admin_eth ?? app.admin}
        scope={{ network: app.network, layer: app.layer }}
      />
      <StakedAmountRow stake={app.stake} ticker={app.ticker} />
      <StatusBadgeRow hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      <ActiveInstancesNumberRow number={app.num_active_instances} />
      <LastActivityRow
        scope={{ network: app.network, layer: app.layer }}
        transaction={app.last_activity_tx}
      />
    </StyledDescriptionList>
  )
}

export const RoflAppDetailsVerticalListView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
  highlightPattern?: HighlightPattern
}> = ({ app, isLoading, highlightPattern }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (isLoading) return <TextSkeleton numberOfRows={5} />
  if (!app) return <></>

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone>
      <NameRow name={app.metadata['net.oasis.rofl.name']} highlightPattern={highlightPattern} />
      <StatusBadgeRow hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
      <DetailsRow title={t('rofl.appId')}>
        <RoflAppLink id={app.id} network={app.network} withSourceIndicator={false} />
      </DetailsRow>
      <ActiveInstancesNumberRow number={app.num_active_instances} />
      <DetailsRow title={t('rofl.created')}>
        {t('common.formattedDateTime', {
          timestamp: new Date(app.date_created),
          formatParams: {
            timestamp: {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            } satisfies Intl.DateTimeFormatOptions,
          },
        })}
      </DetailsRow>
      <DetailsRow title={t('rofl.lastActivity')}>
        <TableCellAge sinceTimestamp={app.last_activity} />
      </DetailsRow>
    </StyledDescriptionList>
  )
}

const NameRow: FC<{
  name?: string
  highlightPattern?: HighlightPattern
}> = ({ name, highlightPattern }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('common.name')}>
      {name ? <HighlightedText text={name} pattern={highlightPattern} /> : t('common.missing')}
    </DetailsRow>
  )
}

const StatusBadgeRow: FC<{
  hasActiveInstances: boolean
  removed: boolean
}> = ({ hasActiveInstances, removed }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('common.status')}>
      <RoflAppStatusBadge hasActiveInstances={hasActiveInstances} removed={removed} />
    </DetailsRow>
  )
}

const ActiveInstancesNumberRow: FC<{
  number: number
}> = ({ number }) => {
  const { t } = useTranslation()
  return <DetailsRow title={t('rofl.activeReplicas')}>{number.toLocaleString()}</DetailsRow>
}

const VersionRow: FC<{
  version: string
}> = ({ version }) => {
  const { t } = useTranslation()
  return <DetailsRow title={t('rofl.version')}>{version || t('common.missing')}</DetailsRow>
}

const TeeRow: FC<{
  policy: RoflAppPolicy
}> = ({ policy }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('rofl.tee')}>
      <TeeType policy={policy} />
    </DetailsRow>
  )
}

const AdminAccountRow: FC<{
  address: string
  scope: SearchScope
}> = ({ address, scope }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('rofl.adminAccount')}>
      <AccountLink scope={scope} address={address} alwaysTrimOnTablet />
      <CopyToClipboard value={address} />
    </DetailsRow>
  )
}

const StakedAmountRow: FC<{
  stake: string
  ticker: Ticker
}> = ({ stake, ticker }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('rofl.stakedAmount')}>
      {t('common.valueInToken', {
        ...getPreciseNumberFormat(stake),
        ticker: ticker,
      })}
    </DetailsRow>
  )
}

const LastActivityRow: FC<{
  scope: SearchScope
  transaction: RuntimeTransaction | undefined
}> = ({ transaction, scope }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('rofl.lastActivity')}>
      {transaction ? <LastActivity scope={scope} transaction={transaction} /> : t('common.missing')}
    </DetailsRow>
  )
}

const DetailsRow: FC<{
  children: ReactNode
  title: ReactNode
}> = ({ children, title }) => {
  return (
    <>
      <dt>{title}</dt>
      <dd>{children}</dd>
    </>
  )
}
