import { FC, MouseEvent } from 'react'
import { COLORS } from '../../../../../styles/theme/colors'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Network } from '../../../../../types/network'
import { useConsensusFreshness, useRuntimeFreshness } from '../../../../components/OfflineBanner/hook'
import { getNetworkIcons } from '../../../../utils/content'
import { useNavigate } from 'react-router-dom'
import { RouteUtils } from '../../../../utils/route-utils'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import CloseIcon from '@mui/icons-material/Close'
import { zIndexHomePage } from '../../index'
import { SelectorArea, UniverseArea } from '../ParaTimeSelector'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface GraphTooltipMobileProps {
  network: Network
  area: SelectorArea
  onClose: (e?: MouseEvent) => void
}

type TooltipInfo = {
  disabled: boolean
  failing?: boolean
  body: GraphTooltipBodyProps
}

const layerTooltipBodyCaption = (t: TFunction, enabled: boolean, outOfDate: boolean | undefined) => {
  if (!enabled) {
    return t('home.tooltip.coming')
  }

  return outOfDate ? t('common.outOfDate') : t('common.online')
}

const useAreaTooltipMap = (network: Network): Partial<Record<SelectorArea, TooltipInfo>> => {
  const isSapphireEnabled = RouteUtils.getAllLayersForNetwork(network).enabled.includes('sapphire')
  const isEmeraldEnabled = RouteUtils.getAllLayersForNetwork(network).enabled.includes('emerald')
  const isCipherEnabled = RouteUtils.getAllLayersForNetwork(network).enabled.includes('cipher')
  const isConsensusEnabled = RouteUtils.getAllLayersForNetwork(network).enabled.includes('consensus')

  const isEmeraldOutOfDate = useRuntimeFreshness({ network, layer: 'emerald' }).outOfDate
  const isSapphireOutOfDate = useRuntimeFreshness({ network, layer: 'sapphire' }).outOfDate
  const isConsensusOutOfDate = useConsensusFreshness(network).outOfDate
  return {
    sapphire: {
      disabled: !isSapphireEnabled,
      body: {
        title: (t: TFunction) => t('common.sapphire'),
        caption: (t: TFunction) => layerTooltipBodyCaption(t, isSapphireEnabled, isSapphireOutOfDate),
        body: (t: TFunction) => t('home.tooltip.sapphireParaTimeDesc'),
      },
      ...(isSapphireEnabled
        ? {
            failing: isSapphireOutOfDate,
          }
        : {}),
    },
    emerald: {
      disabled: !isEmeraldEnabled,
      body: {
        title: (t: TFunction) => t('common.emerald'),
        caption: (t: TFunction) => layerTooltipBodyCaption(t, isEmeraldEnabled, isEmeraldOutOfDate),
        body: (t: TFunction) => t('home.tooltip.emeraldParaTimeDesc'),
      },
      ...(isEmeraldEnabled
        ? {
            failing: isEmeraldOutOfDate,
          }
        : {}),
    },
    cipher: {
      disabled: !isCipherEnabled,
      body: {
        title: (t: TFunction) => t('common.cipher'),
        caption: (t: TFunction) => layerTooltipBodyCaption(t, isCipherEnabled, false /* TODO */),
        body: (t: TFunction) => t('home.tooltip.cipherParaTimeDesc'),
      },
    },
    consensus: {
      disabled: !isConsensusEnabled,
      body: {
        title: (t: TFunction) => t('common.consensus'),
        caption: (t: TFunction) => layerTooltipBodyCaption(t, isConsensusEnabled, isConsensusOutOfDate),
        body: (t: TFunction) => t('home.tooltip.consensusDesc'),
      },
      ...(isConsensusEnabled
        ? {
            failing: isConsensusOutOfDate,
          }
        : {}),
    },
  }
}

interface GraphTooltipHeaderProps {
  disabled: boolean
  network: Network
  area: SelectorArea
}

const GraphTooltipHeader: FC<GraphTooltipHeaderProps> = ({ disabled, network, area }) => {
  const { t } = useTranslation()
  const icons = getNetworkIcons({ size: 38 })

  return (
    <div
      className={cn(
        'relative flex flex-col justify-center items-center h-full w-[120px] border-r-2 text-white rounded-tl-xl sm:rounded-none',
        disabled ? 'cursor-default' : 'cursor-pointer',
      )}
      style={{
        backgroundColor: `${COLORS.brandExtraDark}c0`,
        borderColor: COLORS.aqua,
      }}
    >
      {disabled ? (
        <AccessTimeIcon sx={{ color: COLORS.aqua, fontSize: 33 }} />
      ) : (
        <>
          {icons[network]}
          <span className="text-[10px] text-white absolute bottom-3">
            {area === 'consensus' ? t('home.tooltip.openConsensus') : t('home.tooltip.openParatime')}
          </span>
        </>
      )}
    </div>
  )
}

interface GraphTooltipBodyProps {
  title: (t: TFunction) => string
  caption: (t: TFunction) => string
  body: (t: TFunction) => string
  disabled?: boolean
  failing?: boolean
}

const GraphTooltipBody: FC<GraphTooltipBodyProps> = ({ title, caption, body, disabled, failing }) => {
  const { t } = useTranslation()
  return (
    <div
      className="flex flex-col justify-between flex-1 p-4 text-white rounded-tr-xl"
      style={{
        backgroundColor: disabled ? COLORS.shadowBlue : `${COLORS.brandExtraDark}c0`,
      }}
    >
      <div className="flex justify-between items-center flex-none">
        <Typography className="text-white">{title(t)}</Typography>

        <span className={cn('flex text-xs text-white items-center', disabled ? 'opacity-50' : 'opacity-100')}>
          {caption(t)}
          {!(disabled || failing) && (
            <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
          )}
          {failing && <ErrorIcon sx={{ marginLeft: 2 }} color="error" fontSize="small" />}
        </span>
      </div>
      <div className="flex items-center flex-auto">
        <span className="text-white text-xs leading-[18px]">{body(t)}</span>
      </div>
    </div>
  )
}

export const GraphTooltipMobile: FC<GraphTooltipMobileProps> = ({ network, area, onClose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const tooltip = useAreaTooltipMap(network)[area]
  if (!tooltip) return
  const { body, disabled, failing } = tooltip

  const navigateTo = () => {
    if (disabled) {
      return
    }
    if (area === UniverseArea) {
      return
    }
    navigate(RouteUtils.getDashboardRoute({ network, layer: area }))
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-30"
        style={{ zIndex: zIndexHomePage.mobileTooltip }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 h-[120px] animate-in fade-in duration-300"
        style={{ zIndex: zIndexHomePage.mobileTooltip }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-black/[0.04] fixed right-1 bottom-[125px]"
        >
          <CloseIcon fontSize="medium" sx={{ color: COLORS.white }} aria-label={t('home.tooltip.close')} />
        </Button>
        <div
          onClick={navigateTo}
          className={cn(
            'flex h-full border-2 rounded-t-xl sm:rounded-r-xl sm:rounded-t-none',
            disabled ? 'cursor-default' : 'cursor-pointer',
          )}
          style={{
            borderColor: COLORS.aqua,
          }}
        >
          <GraphTooltipHeader disabled={disabled} network={network} area={area} />
          <GraphTooltipBody {...body} disabled={disabled} failing={failing} />
        </div>
      </div>
    </>
  )
}
