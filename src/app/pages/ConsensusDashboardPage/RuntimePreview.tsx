import { FC, ReactNode, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { styled } from '@mui/material/styles'
import FilterNoneIcon from '@mui/icons-material/FilterNone'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CircleIcon from '@mui/icons-material/Circle'
import { Runtime, useGetRuntimeStatus } from 'oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { InlineDescriptionList } from '../../components/StyledDescriptionList'
import { BlockLink } from '../../components/Blocks/BlockLink'
import { RouterLinkCircle } from '../../components/StyledLinks'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { ChartDuration } from '../../utils/chart-utils'
import { Network } from '../../../types/network'
import { TransactionsChartCard } from '../ParatimeDashboardPage/TransactionsChartCard'
import { ActiveAccounts } from '../ParatimeDashboardPage/ActiveAccounts'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

const StyledList = styled(InlineDescriptionList)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  'dt, dd': {
    display: 'flex',
    padding: theme.spacing(2, 0),
  },
  dt: {
    alignItems: 'start',
  },
  dd: {
    justifyContent: 'end',
  },
}))

type RuntimeProps = {
  prominentItem?: boolean
  network: Network
  runtime: Runtime
}

export const EnabledRuntimePreviewContent: FC<RuntimeProps> = ({ prominentItem, network, runtime }) => {
  const query = useGetRuntimeStatus(network, runtime)
  const { outOfDate } = useRuntimeFreshness({
    network,
    layer: runtime,
  })
  const runtimeStatus = query?.data?.data

  return (
    <RuntimePreview
      prominentItem={prominentItem}
      network={network}
      runtime={runtime}
      status={{
        activeNodes: runtimeStatus?.active_nodes,
        latestBlock: runtimeStatus?.latest_block,
        outOfDate,
      }}
    />
  )
}

export const EnabledRuntimePreview: FC<RuntimeProps> = ({ prominentItem, network, runtime }) => {
  const { t } = useTranslation()
  return (
    <ErrorBoundary light={true} fallbackContent={<b>{t('paratimes.canNotReadStatus', { name: runtime })}</b>}>
      <EnabledRuntimePreviewContent network={network} runtime={runtime} prominentItem={prominentItem} />
    </ErrorBoundary>
  )
}

type DisabledRuntimePreviewProps = {
  runtime: Runtime
}

export const DisabledRuntimePreview: FC<DisabledRuntimePreviewProps> = ({ runtime }) => {
  const { t } = useTranslation()
  const layerLabels = getLayerLabels(t)
  const runtimeLabel = layerLabels[runtime]

  return (
    <div className="flex gap-2 flex-row items-center pt-2 lg:pt-0">
      <Typography className="text-base font-semibold text-primary flex items-center flex-1 min-h-[44px]">
        {runtimeLabel}
      </Typography>
      <div>
        <Badge variant="info">{t('paratimes.inactive')}</Badge>
      </div>
    </div>
  )
}

type RuntimePreviewProps = RuntimeProps & {
  status?: {
    activeNodes: number | undefined
    latestBlock: number | undefined
    outOfDate: boolean | undefined
  }
}

type Panels = 'transactions' | 'accounts'

const RuntimePreview: FC<RuntimePreviewProps> = ({ prominentItem, network, runtime, status }) => {
  const { t } = useTranslation()
  const [panel, setPanel] = useState<Panels>('transactions')
  const layerLabels = getLayerLabels(t)
  const runtimeLabel = layerLabels[runtime]
  const dashboardLink = RouteUtils.getDashboardRoute({ network, layer: runtime })
  const runtimeStatus = status ? (status.outOfDate ? 'outdated' : 'stable') : 'inactive'
  return (
    <div className="flex-1 h-full pb-6 border-b border-gray-200 lg:p-0 lg:pr-4 lg:border-b-0 lg:border-r">
      <div className="mb-4">
        <Typography className="text-base font-semibold text-primary flex items-center flex-1 min-h-[44px]">
          {status ? (
            <>
              <Link asChild>
                <RouterLink to={dashboardLink}>{runtimeLabel}</RouterLink>
              </Link>
              <RouterLinkCircle to={dashboardLink} />
            </>
          ) : (
            <>{runtimeLabel}</>
          )}
        </Typography>
      </div>
      <StyledList>
        <dt>{t('common.status')}:</dt>
        <dd>
          <div>
            {runtimeStatus === 'stable' && <Badge variant="success">{t('common.online')}</Badge>}
            {runtimeStatus === 'outdated' && <Badge variant="error">{t('paratimes.outdated')}</Badge>}
          </div>
        </dd>
        <dt>{t('paratimes.blockNumber')}</dt>
        <dd>
          {status?.latestBlock ? (
            <BlockLink
              scope={{
                layer: runtime,
                network,
              }}
              height={status.latestBlock}
            />
          ) : (
            '-'
          )}
        </dd>
        <dt>{t('paratimes.nodes')} </dt>
        <dd>{status?.activeNodes ? t('paratimes.activeNodes', { nodes: status?.activeNodes }) : '-'} </dd>
      </StyledList>
      <div className="flex gap-2">
        <ChartsContainer status={status}>
          {panel === 'transactions' && (
            <TransactionsChartCard
              scope={{
                layer: runtime,
                network,
              }}
              chartDuration={ChartDuration.TODAY}
              noBorder
            />
          )}
          {panel === 'accounts' && (
            <ActiveAccounts
              scope={{
                layer: runtime,
                network,
              }}
              chartDuration={ChartDuration.TODAY}
              noBorder
            />
          )}
        </ChartsContainer>
        {prominentItem && (
          <ChartsContainer status={status}>
            <ActiveAccounts
              scope={{
                layer: runtime,
                network,
              }}
              chartDuration={ChartDuration.TODAY}
              noBorder
            />
          </ChartsContainer>
        )}
      </div>
      {!prominentItem && (
        <div className="flex justify-center pt-2">
          {status && (
            <>
              <PanelButton
                activePanel={panel}
                ariaLabel={t('common.transactions')}
                panel="transactions"
                setPanel={setPanel}
              />
              <PanelButton
                activePanel={panel}
                ariaLabel={t('account.listTitle')}
                panel="accounts"
                setPanel={setPanel}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

type PanelButtonProps = {
  activePanel: Panels
  ariaLabel: string
  panel: Panels
  setPanel: (panel: Panels) => void
}

const PanelButton: FC<PanelButtonProps> = ({ activePanel, ariaLabel, panel, setPanel }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      onClick={() => setPanel(panel)}
      className="hover:bg-black/[0.04] rounded-full w-[26px] h-[26px]"
    >
      {panel === activePanel ? (
        <CircleIcon sx={{ color: COLORS.brandDark, fontSize: '10px' }} />
      ) : (
        <RadioButtonUncheckedIcon sx={{ color: COLORS.brandDark, fontSize: '10px' }} />
      )}
    </Button>
  )
}

type ChartsContainerProps = {
  children: ReactNode
  status?: {
    activeNodes: number | undefined
    latestBlock: number | undefined
    outOfDate: boolean | undefined
  }
}

const ChartsContainer: FC<ChartsContainerProps> = ({ children, status }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 items-center justify-center h-[180px] border-1 border-gray-200 rounded-md overflow-hidden">
      <div className="flex flex-1 flex-col items-center gap-2">
        {status && <div className="w-full">{children}</div>}
        {!status && (
          <>
            <FilterNoneIcon sx={{ color: COLORS.brandDark, fontSize: '33px' }} />
            {t('paratimes.noData')}
          </>
        )}
      </div>
    </div>
  )
}
