import { FC, ReactNode } from 'react'
import { useHref, useLoaderData } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import InfoIcon from '@mui/icons-material/Info'
import { RoflApp, RoflAppPolicy, RuntimeTransaction, useGetRuntimeRoflAppsId } from '../../../oasis-nexus/api'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import { AppErrors } from '../../../types/errors'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useRuntimeTxMethodParam } from '../../hooks/useCommonParams'
import { COLORS } from '../../../styles/theme/colors'
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
import { HighlightedText } from '../../components/HighlightedText'
import { RoflAppLoaderData } from '../../utils/route-utils'
import { AdvancedField } from '../../components/AdvancedField/AdvancedField'
import { ToggleAdvancedFields } from '../../components/AdvancedField/ToggleAdvancedFields'

export const RoflAppDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()
  const { id } = useLoaderData() as RoflAppLoaderData
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
                labelOnly
                trimMode={'adaptive'}
                withSourceIndicator={false}
              />
            )
          )
        }
      >
        <RoflAppDetailsView isLoading={isLoading} app={roflApp} />
      </SubPageCard>
      <AdvancedField>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-6 flex">
            <MetaDataCard isFetched={isFetched} metadata={roflApp?.metadata} />
          </div>
          <div className="col-span-12 lg:col-span-6 flex">
            {roflApp && (
              <PolicyCard
                id={roflApp?.id}
                network={roflApp?.network}
                layer={roflApp?.layer}
                isFetched={isFetched}
                policy={roflApp?.policy}
              />
            )}
          </div>
        </div>
      </AdvancedField>
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

export const RoflAppDetailsView: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
}> = ({ app, isLoading }) => {
  const { t } = useTranslation()

  if (isLoading) return <TextSkeleton numberOfRows={15} />
  if (!app) return <></>

  return (
    <>
      <StyledDescriptionList>
        <NameRow name={app.metadata['net.oasis.rofl.name']} />
        <VersionRow version={app.metadata['net.oasis.rofl.version']} />
        <TeeRow policy={app.policy} />
        <DetailsRow title={t('rofl.appId')}>
          <WithHoverHighlighting address={app.id}>
            <span className="font-medium">{app.id}</span>
          </WithHoverHighlighting>
          <CopyToClipboard value={app.id} />
        </DetailsRow>
        <AdvancedField>
          <DetailsRow title={t('rofl.enclaveId')}>
            <Enclaves policy={app.policy} />
          </DetailsRow>
          <AdminAccountRow
            address={app.admin_eth ?? app.admin}
            scope={{ network: app.network, layer: app.layer }}
          />
          <StakedAmountRow stake={app.stake} ticker={app.ticker} />
        </AdvancedField>
        <StatusBadgeRow hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
        <AdvancedField>
          <ActiveInstancesNumberRow number={app.num_active_instances} />
        </AdvancedField>
        <LastActivityRow
          scope={{ network: app.network, layer: app.layer }}
          transaction={app.last_activity_tx}
        />
        <AdvancedField>
          <DetailsRow title={t('rofl.endorsement')}>
            <div className="flex flex-1 flex-col">
              <Endorsement
                endorsements={app.policy.endorsements}
                groupOp={'or'} // We have an implicit default "or" for toplevel endorsement
              />
            </div>
          </DetailsRow>
          <DetailsRow
            title={
              <div className="flex items-center gap-4">
                {t('rofl.sekPublicKey')}
                <Tooltip title={t('rofl.sekPublicKeyTooltip')}>
                  <InfoIcon htmlColor={COLORS.brandDark} fontSize="small" />
                </Tooltip>
              </div>
            }
          >
            <span className="font-medium">{app.sek}</span> <CopyToClipboard value={app.sek} />
          </DetailsRow>
          <DetailsRow
            title={
              <div className="flex items-center gap-4">
                {t('rofl.secrets')}
                <Tooltip title={t('rofl.secretsTooltip')}>
                  <InfoIcon htmlColor={COLORS.brandDark} fontSize="small" />
                </Tooltip>
              </div>
            }
          >
            <Secrets secrets={app.secrets} />
          </DetailsRow>
        </AdvancedField>
      </StyledDescriptionList>
      <ToggleAdvancedFields />
    </>
  )
}

export const RoflAppDetailsViewSearchResult: FC<{
  isLoading?: boolean
  app: RoflApp | undefined
}> = ({ app, isLoading }) => {
  const { t } = useTranslation()

  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!app) return <></>

  return (
    <StyledDescriptionList>
      <dt>{t('common.name')}</dt>
      <dd>
        <RoflAppLink
          id={app.id}
          name={app.metadata['net.oasis.rofl.name']}
          network={app.network}
          withSourceIndicator={false}
        />
        <CopyToClipboard value={app.metadata['net.oasis.rofl.name']} />
      </dd>
      <DetailsRow title={t('common.paratime')}>
        <DashboardLink scope={{ network: app.network, layer: app.layer }} />
      </DetailsRow>
      <VersionRow version={app.metadata['net.oasis.rofl.version']} />
      <DetailsRow title={t('rofl.appId')}>
        <RoflAppLink id={app.id} name={app.id} network={app.network} withSourceIndicator={false} />
        <CopyToClipboard value={app.id} />
      </DetailsRow>
      <AdminAccountRow
        address={app.admin_eth ?? app.admin}
        scope={{ network: app.network, layer: app.layer }}
      />
      <StakedAmountRow stake={app.stake} ticker={app.ticker} />
      <StatusBadgeRow hasActiveInstances={!!app.num_active_instances} removed={app.removed} />
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
}> = ({ app, isLoading }) => {
  const { t } = useTranslation()

  if (isLoading) return <TextSkeleton numberOfRows={5} />
  if (!app) return <></>

  return (
    <StyledDescriptionList standalone>
      <NameRow name={app.metadata['net.oasis.rofl.name']} />
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
}> = ({ name }) => {
  const { t } = useTranslation()
  return (
    <DetailsRow title={t('common.name')}>
      {name ? <HighlightedText text={name} /> : t('common.missing')}
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
