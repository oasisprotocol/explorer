import { FC, ReactNode, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import FilterNoneIcon from '@mui/icons-material/FilterNone'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CircleIcon from '@mui/icons-material/Circle'
import { Runtime, useGetRuntimeStatus } from 'oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { RuntimeStatusIcon } from '../../components/RuntimeStatusIcon'
import { InlineDescriptionList } from '../../components/StyledDescriptionList'
import { BlockLink } from '../../components/Blocks/BlockLink'
import { RouterLinkCircle } from '../../components/StyledLinks'
import { getLayerLabels } from '../../utils/content'
import { RouteUtils } from '../../utils/route-utils'
import { ChartDuration } from '../../utils/chart-utils'
import { Network } from '../../../types/network'
import { TransactionsChartCard } from '../ParatimeDashboardPage/TransactionsChartCard'
import { ActiveAccounts } from '../ParatimeDashboardPage/ActiveAccounts'

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

const StyledBox = styled(Box)(() => ({
  border: `2px solid ${COLORS.brandDark}`,
  borderRadius: '12px',
  height: '180px',
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 34px 24px -9px #324DAB1F',
  overflow: 'hidden',
}))

const StyledTypography = styled(Typography)(() => ({
  fontSize: '18px',
  fontWeight: 700,
  color: COLORS.brandDark,
  flex: 1,
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
}))

const StyledDisabledRuntime = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 3,
  paddingTop: theme.spacing(3),
  flexDirection: 'row',
  alignItems: 'center',
  [theme.breakpoints.between('md', 'xl')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

const StyledEnabledRuntime = styled(Box)(({ theme }) => ({
  flex: 1,
  height: '100%',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    paddingBottom: theme.spacing(5),
    borderBottom: `1px solid ${COLORS.grayMediumLight}`,
  },
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(5),
    borderRight: `1px solid ${COLORS.grayMediumLight}`,
  },
}))

type RuntimeProps = {
  prominentItem?: boolean
  network: Network
  runtime: Runtime
}

export const EnabledRuntimePreview: FC<RuntimeProps> = ({ prominentItem, network, runtime }) => {
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

type DisabledRuntimePreviewProps = {
  runtime: Runtime
}

export const DisabledRuntimePreview: FC<DisabledRuntimePreviewProps> = ({ runtime }) => {
  const { t } = useTranslation()
  const layerLabels = getLayerLabels(t)
  const runtimeLabel = layerLabels[runtime]

  return (
    <StyledDisabledRuntime>
      <StyledTypography>{runtimeLabel}</StyledTypography>
      <Box>
        <RuntimeStatusIcon status="inactive" />
      </Box>
    </StyledDisabledRuntime>
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
    <StyledEnabledRuntime>
      <Box sx={{ marginBottom: 4 }}>
        <StyledTypography>
          {status ? (
            <>
              <Link component={RouterLink} to={dashboardLink}>
                {runtimeLabel}
              </Link>
              <RouterLinkCircle to={dashboardLink} />
            </>
          ) : (
            <>{runtimeLabel}</>
          )}
        </StyledTypography>
      </Box>
      <StyledList>
        <dt>{t('common.status')}:</dt>
        <dd>
          <Box>
            <RuntimeStatusIcon status={runtimeStatus} />
          </Box>
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
      <Box sx={{ display: 'flex', gap: 3 }}>
        <ChartsContainer status={status}>
          {panel === 'transactions' && (
            <TransactionsChartCard
              scope={{
                layer: runtime,
                network,
              }}
              chartDuration={ChartDuration.TODAY}
            />
          )}
          {panel === 'accounts' && (
            <ActiveAccounts
              scope={{
                layer: runtime,
                network,
              }}
              chartDuration={ChartDuration.TODAY}
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
            />
          </ChartsContainer>
        )}
      </Box>
      {!prominentItem && (
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
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
        </Box>
      )}
    </StyledEnabledRuntime>
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
    <>
      <IconButton aria-label={ariaLabel} onClick={() => setPanel(panel)}>
        {panel === activePanel ? (
          <CircleIcon sx={{ color: COLORS.brandDark, fontSize: '10px' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ color: COLORS.brandDark, fontSize: '10px' }} />
        )}
      </IconButton>
    </>
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
    <StyledBox>
      <Box gap={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {status && <Box sx={{ width: '100%' }}>{children}</Box>}
        {!status && (
          <>
            <FilterNoneIcon sx={{ color: COLORS.brandDark, fontSize: '33px' }} />
            {t('paratimes.noData')}
          </>
        )}
      </Box>
    </StyledBox>
  )
}
