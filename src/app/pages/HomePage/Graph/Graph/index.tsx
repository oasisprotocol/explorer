import { Link, useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import {
  FC,
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { RouteUtils, isLocalnet } from '../../../../utils/route-utils'
import { useScreenSize } from '../../../../hooks/useScreensize'
import { Layer } from '../../../../../oasis-nexus/api'
import { Network } from '../../../../../types/network'
import { COLORS } from '../../../../../styles/theme/testnet/colors'
import { COLORS as LOCALNET_COLORS } from '../../../../../styles/theme/localnet/colors'
import { useTranslation } from 'react-i18next'
import { useConsensusFreshness, useRuntimeFreshness } from '../../../../components/OfflineBanner/hook'
import { SearchScope } from '../../../../../types/searchScope'
import { SelectorArea, UniverseArea } from '../ParaTimeSelector'

interface GraphBaseProps {
  disabled?: boolean
  transparent?: boolean
}

interface GraphProps extends GraphBaseProps {
  network: Network
  scale: number
  // TODO: Consider moving this to a state management solution
  selectedArea?: SelectorArea
  setSelectedArea: (value: SelectorArea) => void
  setActiveMobileGraphTooltip: (area: { current: SelectorArea | null }) => void
  isZoomedIn: boolean
}

interface GraphStyledProps extends GraphBaseProps {
  selectedArea?: SelectorArea
  hoveredLayer: Layer | null
}

const LayerNotEnabledLabel = ({ network }: { network: Network }) => {
  const { t } = useTranslation()
  const isLocal = isLocalnet(network)

  return (
    <>
      <tspan dx="-4" dy="-5">
        {isLocal ? t('home.not') : t('home.coming')}
      </tspan>
      <tspan dx="-35" dy="12">
        {isLocal ? t('home.enabled') : t('home.soon')}
      </tspan>
    </>
  )
}

const GraphStyled = styled('svg', {
  shouldForwardProp: prop =>
    !(['disabled', 'transparent', 'selectedArea', 'hoveredLayer'] as (keyof GraphStyledProps)[]).includes(
      prop as keyof GraphStyledProps,
    ),
})<GraphStyledProps>(({ theme, disabled, transparent, selectedArea, hoveredLayer }) => ({
  position: 'absolute',
  left: '50%',
  top: '45%',
  width: '80%',
  height: '80%',
  transform: 'translate(-50%, -50%)',
  ...(disabled || transparent
    ? {
        pointerEvents: 'none',
      }
    : {}),
  ...(transparent
    ? {
        opacity: 0.25,
      }
    : {}),
  '[id]:not([aria-disabled="true"])': {
    cursor: 'pointer',
  },
  path: {
    ...(selectedArea && selectedArea !== Layer.consensus && selectedArea !== UniverseArea
      ? {
          [`&:not(.${selectedArea})`]: {
            opacity: 0.5,
          },
          '&.status-icon': {
            opacity: 1,
          },
        }
      : {}),
  },
  'g[id$=circle]': {
    'ellipse:not(:last-child)': {
      display: 'inline',
    },
    'ellipse:last-child': {
      display: 'none',
    },
    ...(selectedArea && selectedArea !== Layer.consensus && selectedArea !== UniverseArea
      ? {
          [`&:not([id=${selectedArea}-circle])`]: {
            opacity: 0.5,
          },
        }
      : {}),
  },
  [theme.breakpoints.up('md')]: {
    'g[id$=circle]': {
      '&:hover, &:focus-visible': {
        'ellipse:not(.hover-bg)': {
          display: 'none',
        },
        'ellipse.hover-bg': {
          display: 'inline',
        },
        'circle:not(.no-hide)': {
          display: 'none',
        },
      },
    },
    [`g[id$=${hoveredLayer}-circle]`]: {
      'ellipse:not(.hover-bg)': {
        display: 'none',
      },
      'ellipse.hover-bg': {
        display: 'inline',
      },
      'circle:not(.no-hide)': {
        display: 'none',
      },
    },
  },
  text: {
    userSelect: 'none',
    pointerEvents: 'none',
  },
  'g.highlight': {
    '&:hover, &:focus-visible': {
      path: {
        strokeWidth: 4,
      },
    },
  },
  '&.testnet': {
    'g.highlight': {
      '&:hover, &:focus-visible': {
        path: {
          stroke: COLORS.brandExtraDark,
        },
      },
    },
  },
}))

const preventDoubleClick: { onDoubleClick: MouseEventHandler } = {
  onDoubleClick: e => e.preventDefault(),
}

const handleHover: (
  layer: Layer,
  set: (layer: Layer | null) => void,
) => {
  onMouseEnter: MouseEventHandler
  onMouseLeave: MouseEventHandler
} = (layer: Layer, set: (layer: Layer | null) => void) => ({
  onMouseEnter: () => {
    set(layer)
  },
  onMouseLeave: () => {
    set(null)
  },
})

const GraphLayerStatus: FC<
  PropsWithChildren<{
    fillText: string
    iconX: number
    iconY: number
    textX: number
    textY: number
    outOfDate: boolean | undefined
  }>
> = ({ children, fillText, iconX, iconY, textX, textY, outOfDate }) => {
  const { t } = useTranslation()

  if (outOfDate === undefined) {
    return (
      <text x={textX} y={textY} fill={fillText} fontSize="12px">
        {children}
      </text>
    )
  }

  return (
    <>
      <text x={textX} y={textY} fill={fillText} fontSize="12px">
        {children}
        {!outOfDate && (
          <tspan dx="-40" dy="12" fontSize="7px">
            {t('common.online')}
          </tspan>
        )}
        {outOfDate && (
          <tspan dx="-40" dy="12" fontSize="7px">
            {t('home.offline')}
          </tspan>
        )}
      </text>
      <g transform={`translate(${iconX}, ${iconY}) scale(0.4)`}>
        {!outOfDate && (
          <path
            className="status-icon"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            fill={COLORS.eucalyptus}
          />
        )}
        {outOfDate && (
          <path
            className="status-icon"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            fill={COLORS.error}
          />
        )}
      </g>
    </>
  )
}

const ConsensusStatus: FC<{ network: Network; statusChange: (outOfDate?: boolean) => void }> = ({
  network,
  statusChange,
}) => {
  const { outOfDate } = useConsensusFreshness(network)

  useEffect(() => {
    statusChange(outOfDate)
    return () => {
      statusChange(undefined)
    }
  }, [outOfDate, statusChange])

  return null
}

const RuntimeStatus: FC<{ scope: SearchScope; statusChange: (outOfDate?: boolean) => void }> = ({
  scope,
  statusChange,
}) => {
  const { outOfDate } = useRuntimeFreshness(scope)

  useEffect(() => {
    statusChange(outOfDate)
    return () => {
      statusChange(undefined)
    }
  }, [outOfDate, statusChange])

  return null
}

const LayerStatus: FC<{ scope: SearchScope; statusChange: (outOfDate?: boolean) => void }> = ({
  scope,
  statusChange,
}) =>
  scope.layer === Layer.consensus ? (
    <ConsensusStatus network={scope.network} statusChange={statusChange} />
  ) : (
    <RuntimeStatus scope={scope} statusChange={statusChange} />
  )

const GraphCmp: ForwardRefRenderFunction<SVGSVGElement, GraphProps> = (
  {
    disabled = false,
    transparent = false,
    selectedArea,
    network,
    setSelectedArea,
    scale,
    setActiveMobileGraphTooltip,
    isZoomedIn,
  },
  ref,
) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile } = useScreenSize()
  const [hoveredLayer, setHoveredLayer] = useState<Layer | null>(null)
  const [outOfDateMap, setOutOfDateMap] = useState<
    Partial<{
      [key in Layer]: boolean | undefined
    }>
  >({})

  useEffect(() => {
    setActiveMobileGraphTooltip({ current: null })
    // should only close tooltips on isMobile change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    setOutOfDateMap({})
  }, [network])

  const isLayerDisabled = (Layer: Layer) => {
    return !RouteUtils.getAllLayersForNetwork(network).enabled.includes(Layer)
  }

  const disabledMap: Partial<Record<SelectorArea, boolean>> = {
    [Layer.emerald]: isLayerDisabled(Layer.emerald),
    [Layer.consensus]: isLayerDisabled(Layer.consensus),
    [Layer.cipher]: isLayerDisabled(Layer.cipher),
    [Layer.sapphire]: isLayerDisabled(Layer.sapphire),
  }

  const enabledLayers: Layer[] = useMemo(() => RouteUtils.getAllLayersForNetwork(network).enabled, [network])

  const onSelectArea = (area: SelectorArea) => {
    if (isMobile && (isZoomedIn || area === Layer.consensus)) {
      setSelectedArea(area)
      setActiveMobileGraphTooltip({ current: area })

      return
    }

    if (
      ((!isMobile && !isZoomedIn) || area === selectedArea) &&
      area !== UniverseArea &&
      RouteUtils.getAllLayersForNetwork(network).enabled.includes(area)
    ) {
      navigate(RouteUtils.getDashboardRoute({ network, layer: area }))

      return
    }

    if (!disabledMap[area]) {
      setSelectedArea(area)
    }
  }

  const graphThemes = {
    mainnet: {
      cipherCircle: 'url(#paint7_radial_6093_287252)',
      cipherCircleFilter: 'url(#filter2_dii_6093_287252)',
      cipherCircleFill: COLORS.darkBlue,
      emeraldCircle: 'url(#paint6_radial_6093_287252)',
      emeraldCircleFilter: 'url(#filter0_dii_6093_287252)',
      sapphireCircle: 'url(#paint7_radial_6093_287252)',
      sapphireCircleFilter: 'url(#filter1_dii_6093_287252)',
      consensusCircle: COLORS.brandExtraDark,
      line: COLORS.aqua,
      text: COLORS.white,
      textBackground: COLORS.graphLabel,
      textBorder: COLORS.graphLine,
      circleBorder: COLORS.brandExtraDark,
      hoverBackground: COLORS.aqua,
      hoverText: COLORS.brandExtraDark,
    },
    testnet: {
      cipherCircle: COLORS.testnet,
      cipherCircleFilter: 'url(#filter2_di_6093_290291)',
      cipherCircleFill: COLORS.testnet,
      emeraldCircle: COLORS.testnet,
      emeraldCircleFilter: 'url(#filter0_di_6093_290291)',
      sapphireCircle: COLORS.testnet,
      sapphireCircleFilter: 'url(#filter1_di_6093_290291)',
      consensusCircle: COLORS.testnetLight,
      line: COLORS.testnet,
      text: COLORS.brandExtraDark,
      textBackground: COLORS.testnetLight,
      textBorder: COLORS.testnet,
      circleBorder: COLORS.testnet,
      hoverBackground: COLORS.brandExtraDark,
      hoverText: COLORS.white,
    },
    localnet: {
      cipherCircle: LOCALNET_COLORS.localnet,
      cipherCircleFilter: 'url(#filter2_di_6093_290291)',
      cipherCircleFill: LOCALNET_COLORS.localnet,
      emeraldCircle: LOCALNET_COLORS.localnet,
      emeraldCircleFilter: 'url(#filter0_di_6093_290291)',
      sapphireCircle: LOCALNET_COLORS.localnet,
      sapphireCircleFilter: 'url(#filter1_di_6093_290291)',
      consensusCircle: LOCALNET_COLORS.localnetLight,
      line: LOCALNET_COLORS.localnet,
      text: COLORS.brandExtraDark,
      textBackground: LOCALNET_COLORS.localnetLight,
      textBorder: LOCALNET_COLORS.localnet,
      circleBorder: LOCALNET_COLORS.localnet,
      hoverBackground: COLORS.brandExtraDark,
      hoverText: COLORS.white,
    },
  }

  const graphTheme = graphThemes[network]

  const layers = useMemo(
    () =>
      enabledLayers.map(layer => (
        <LayerStatus
          key={layer}
          scope={{
            network,
            layer,
          }}
          statusChange={outOfDate => setOutOfDateMap(prevValue => ({ ...prevValue, [layer]: outOfDate }))}
        />
      )),
    [network, enabledLayers],
  )

  return (
    <>
      {isZoomedIn && network && layers}
      <GraphStyled
        width="396"
        height="387"
        viewBox="0 0 396 387"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        disabled={disabled}
        transparent={transparent}
        preserveAspectRatio="xMidYMid slice"
        ref={ref}
        className={network}
        selectedArea={selectedArea}
        hoveredLayer={hoveredLayer}
      >
        <path
          d="M257.947 218.31C259.1 209.19 258.447 199.932 256.023 191.064C253.598 182.197 249.452 173.894 243.819 166.629C238.186 159.364 231.177 153.28 223.193 148.724C215.208 144.168 206.405 141.229 197.285 140.075C188.164 138.921 178.906 139.575 170.039 141.999C161.172 144.423 152.868 148.57 145.604 154.203C138.339 159.836 132.255 166.844 127.698 174.829C123.142 182.813 120.203 191.617 119.05 200.737C117.896 209.857 118.549 219.115 120.974 227.982C123.398 236.85 127.545 245.153 133.178 252.418C138.811 259.683 145.819 265.767 153.804 270.323C161.788 274.879 170.591 277.818 179.712 278.972C188.832 280.126 198.09 279.472 206.957 277.048C215.825 274.624 224.128 270.477 231.393 264.844C238.657 259.211 244.742 252.202 249.298 244.218C253.854 236.233 256.793 227.43 257.947 218.31L257.947 218.31Z"
          stroke={graphTheme.line}
          strokeWidth="6.16169"
          strokeDasharray="0.27 2.71"
        />
        <path
          className={Layer.emerald}
          d="M195.673 102.451L155.947 76.6719"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        <path
          className={Layer.emerald}
          d="M195.674 102.451L235.399 73.925"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        <path
          className={Layer.consensus}
          d="M183.768 210.158L308.693 202.227"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        <path
          className={Layer.consensus}
          d="M187.221 212.965L195.884 103.508"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        <path
          className={Layer.consensus}
          d="M167.502 240L132.572 287.516"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        {/* Sapphire blocks connector */}
        <path
          className={Layer.sapphire}
          d="M119.797 314.743L106.953 360.325"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        {/* Sapphire transactions connector */}
        <path
          className={Layer.sapphire}
          d="M127.499 301.83L163.135 335.325"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        {/* Sapphire ROFL connector */}
        <path
          className={Layer.sapphire}
          d="M112.787 294.07L79.1411 258.575"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        {/* Sapphire tokens connector */}
        <path
          className={Layer.sapphire}
          d="M106.873 307.197L59.0528 317.448"
          stroke={graphTheme.line}
          strokeWidth="2"
        />
        <path
          className={Layer.emerald}
          d="M197.319 77.6547L196.607 28.753"
          stroke={graphTheme.line}
          strokeWidth="2"
        />

        <g style={{ pointerEvents: !disabledMap.emerald ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getLatestTransactionsRoute({ network, layer: Layer.emerald })}>
            <path
              className={Layer.emerald}
              d="M250.839 37.333C262.715 37.333 272.341 46.9589 272.341 58.833C272.341 70.7071 262.715 80.333 250.839 80.333C238.964 80.333 229.338 70.7071 229.338 58.833C229.338 46.9589 238.964 37.333 250.839 37.333Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="240" y="61.83" fill={graphTheme.text} fontSize="10px">
              {t('home.txns')}
            </text>
          </Link>
        </g>
        <g style={{ pointerEvents: !disabledMap.emerald ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getLatestBlocksRoute({ network, layer: Layer.emerald })}>
            <path
              className={Layer.emerald}
              d="M139.839 39.333C151.715 39.333 161.341 48.9589 161.341 60.833C161.341 72.7071 151.715 82.333 139.839 82.333C127.964 82.333 118.338 72.7071 118.338 60.833C118.338 48.9589 127.964 39.333 139.839 39.333Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="126.872" y="63.833" fill={graphTheme.text} fontSize="10px">
              {t('home.blocks')}
            </text>
          </Link>
        </g>
        <g style={{ pointerEvents: !disabledMap.emerald ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getTopTokensRoute({ network, layer: Layer.emerald })}>
            <path
              className={Layer.emerald}
              d="M196.839 3.27392C208.715 3.27392 218.341 12.8998 218.341 24.7739C218.341 36.648 208.715 46.2739 196.839 46.2739C184.964 46.2739 175.338 36.648 175.338 24.7739C175.338 12.8998 184.964 3.27393 196.839 3.27392Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="182.607" y="27.77" fill={graphTheme.text} fontSize="10px">
              {t('common.tokens')}
            </text>
          </Link>
        </g>

        <g style={{ pointerEvents: !disabledMap.sapphire ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getLatestBlocksRoute({ network, layer: Layer.sapphire })}>
            <path
              className={Layer.sapphire}
              d="M106.838 341.892C118.713 341.892 128.339 351.518 128.339 363.392C128.339 375.267 118.713 384.892 106.838 384.892C94.9625 384.892 85.3359 375.267 85.3359 363.392C85.3359 351.518 94.9625 341.892 106.838 341.892Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="92.5" y="366.5" fill={graphTheme.text} fontSize="10px">
              {t('home.blocks')}
            </text>
          </Link>
        </g>
        <g style={{ pointerEvents: !disabledMap.sapphire ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getLatestTransactionsRoute({ network, layer: Layer.sapphire })}>
            <path
              className={Layer.sapphire}
              d="M176.838 325.392C188.713 325.392 198.339 335.018 198.339 346.892C198.339 358.767 188.713 368.392 176.838 368.392C164.962 368.392 155.336 358.767 155.336 346.892C155.336 335.018 164.962 325.392 176.838 325.392Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="167" y="350" fill={graphTheme.text} fontSize="10px">
              {t('home.txns')}
            </text>
          </Link>
        </g>
        <g style={{ pointerEvents: !disabledMap.sapphire ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getTopTokensRoute({ network, layer: Layer.sapphire })}>
            <path
              className={Layer.sapphire}
              d="M50.8375 297.392C62.7126 297.392 72.3391 307.018 72.3391 318.892C72.3391 330.767 62.7126 340.392 50.8375 340.392C38.9625 340.392 29.3359 330.767 29.3359 318.892C29.3359 307.018 38.9625 297.392 50.8375 297.392Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="36" y="322" fill={graphTheme.text} fontSize="10px">
              {t('common.tokens')}
            </text>
          </Link>
        </g>
        <g style={{ pointerEvents: !disabledMap.sapphire ? 'auto' : 'none' }} className="highlight">
          <Link to={RouteUtils.getRoflAppsRoute(network)}>
            <path
              className={Layer.sapphire}
              d="M75.8375 233.392C87.7126 233.392 97.3391 243.018 97.3391 254.892C97.3391 266.767 87.7126 276.392 75.8375 276.392C63.9625 276.392 54.3359 266.767 54.3359 254.892C54.3359 243.018 63.9625 233.392 75.8375 233.392Z"
              fill={graphTheme.circleBorder}
              stroke={graphTheme.line}
            />
            <text x="64" y="258" fill={graphTheme.text} fontSize="10px">
              {t('common.rofl')}
            </text>
          </Link>
        </g>

        <g
          id={`${Layer.emerald}-circle`}
          aria-disabled={disabledMap[Layer.emerald]}
          onClick={() => onSelectArea(Layer.emerald)}
          filter={graphTheme.emeraldCircleFilter}
          {...preventDoubleClick}
          {...handleHover(Layer.emerald, setHoveredLayer)}
        >
          {network === Network.mainnet && (
            <ellipse cx="195.702" cy="94.6959" rx="31.6963" ry="31.6959" fill="#030092" />
          )}
          <ellipse cx="195.702" cy="94.6959" rx="31.6963" ry="31.6959" fill={graphTheme.emeraldCircle} />
          <ellipse
            className="hover-bg"
            cx="195.702"
            cy="94.6959"
            rx="31.6963"
            ry="31.6959"
            fill={graphTheme.hoverBackground}
          />
        </g>
        <g
          id={`${Layer.emerald}-label`}
          aria-disabled={disabledMap[Layer.emerald]}
          onClick={() => onSelectArea(Layer.emerald)}
          {...preventDoubleClick}
          {...handleHover(Layer.emerald, setHoveredLayer)}
        >
          {(isMobile || hoveredLayer !== Layer.emerald) && (
            <GraphLayerStatus
              iconX={201}
              iconY={102}
              textX={174}
              textY={97}
              fillText={graphTheme.text}
              outOfDate={outOfDateMap.emerald}
            >
              {t('common.emerald')}
            </GraphLayerStatus>
          )}

          {!isMobile && hoveredLayer === Layer.emerald && !disabledMap[Layer.emerald] && (
            <text x="181.5" y="97" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              {t('common.view')}
            </text>
          )}
          {!isMobile && hoveredLayer === Layer.emerald && disabledMap[Layer.emerald] && (
            <text x="177.4" y="97" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              <LayerNotEnabledLabel network={network} />
            </text>
          )}
        </g>
        <g
          id={`${Layer.sapphire}-circle`}
          aria-disabled={disabledMap[Layer.sapphire]}
          onClick={() => onSelectArea(Layer.sapphire)}
          filter={graphTheme.sapphireCircleFilter}
          {...preventDoubleClick}
          {...handleHover(Layer.sapphire, setHoveredLayer)}
        >
          {network === Network.mainnet && (
            <ellipse cx="123.702" cy="302.696" rx="31.6963" ry="31.6959" fill="#030092" />
          )}
          <ellipse cx="123.702" cy="302.696" rx="31.6963" ry="31.6959" fill={graphTheme.sapphireCircle} />
          <ellipse
            className="hover-bg"
            cx="123.702"
            cy="302.696"
            rx="31.6963"
            ry="31.6959"
            fill={graphTheme.hoverBackground}
          />
        </g>
        <g
          id={`${Layer.sapphire}-label`}
          aria-disabled={disabledMap[Layer.sapphire]}
          onClick={() => onSelectArea(Layer.sapphire)}
          {...preventDoubleClick}
          {...handleHover(Layer.sapphire, setHoveredLayer)}
        >
          {(isMobile || hoveredLayer !== Layer.sapphire) && (
            <GraphLayerStatus
              iconX={130}
              iconY={310}
              textX={100}
              textY={305}
              fillText={graphTheme.text}
              outOfDate={outOfDateMap.sapphire}
            >
              {t('common.sapphire')}
            </GraphLayerStatus>
          )}
          {!isMobile && hoveredLayer === Layer.sapphire && !disabledMap[Layer.sapphire] && (
            <text x="109.5" y="307" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              {t('common.view')}
            </text>
          )}
          {!isMobile && hoveredLayer === Layer.sapphire && disabledMap[Layer.sapphire] && (
            <text x="106" y="305" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              <LayerNotEnabledLabel network={network} />
            </text>
          )}
        </g>
        <g
          id={`${Layer.consensus}-circle`}
          onClick={() => onSelectArea(Layer.consensus)}
          aria-disabled={disabledMap[Layer.consensus]}
          {...handleHover(Layer.consensus, setHoveredLayer)}
        >
          <circle
            className="no-hide"
            opacity="0.25"
            cx="188.995"
            cy="209.993"
            r="52.9926"
            transform="rotate(-90 188.995 209.993)"
            fill={graphTheme.line}
            {...preventDoubleClick}
          />
          <circle
            cx="188.502"
            cy="209.5"
            r="42.5"
            transform="rotate(-90 188.502 209.5)"
            fill={graphTheme.line}
            {...preventDoubleClick}
          />
          <circle
            cx="189.002"
            cy="210"
            r="36"
            transform="rotate(-90 189.002 210)"
            fill={graphTheme.consensusCircle}
            {...preventDoubleClick}
          />
          <ellipse
            className="hover-bg"
            cx="188.502"
            cy="209.5"
            rx="42.5"
            ry="42.5"
            transform="rotate(-90 188.995 209.5)"
            fill={graphTheme.hoverBackground}
          />
        </g>
        <g
          id={`${Layer.consensus}-label`}
          aria-disabled={disabledMap[Layer.consensus]}
          onClick={() => onSelectArea(Layer.consensus)}
          {...preventDoubleClick}
          {...handleHover(Layer.consensus, setHoveredLayer)}
        >
          {(isMobile || hoveredLayer !== Layer.consensus) && (
            <GraphLayerStatus
              iconX={201}
              iconY={216}
              textX={159}
              textY={212}
              fillText={graphTheme.text}
              outOfDate={outOfDateMap.consensus}
            >
              {t('common.consensus')}
            </GraphLayerStatus>
          )}
          {!isMobile && hoveredLayer === Layer.consensus && !disabledMap[Layer.consensus] && (
            <text x="173" y="214" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              {t('common.view')}
            </text>
          )}
          {!isMobile && hoveredLayer === Layer.consensus && disabledMap[Layer.consensus] && (
            <text x="170" y="212" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              <LayerNotEnabledLabel network={network} />
            </text>
          )}
        </g>
        <g
          filter={graphTheme.cipherCircleFilter}
          aria-disabled={disabledMap[Layer.cipher]}
          onClick={() => onSelectArea(Layer.cipher)}
          id={`${Layer.cipher}-circle`}
          {...preventDoubleClick}
          {...handleHover(Layer.cipher, setHoveredLayer)}
        >
          <ellipse cx="306.702" cy="201.696" rx="31.6963" ry="31.6959" fill={graphTheme.cipherCircleFill} />
          {network === Network.mainnet && (
            <ellipse cx="306.702" cy="201.696" rx="31.6963" ry="31.6959" fill={graphTheme.cipherCircle} />
          )}
          <ellipse
            className="hover-bg"
            cx="306.702"
            cy="201.696"
            rx="31.6963"
            ry="31.6959"
            fill={graphTheme.hoverBackground}
          />
        </g>
        <g
          id={`${Layer.cipher}-label`}
          aria-disabled={disabledMap[Layer.cipher]}
          onClick={() => onSelectArea(Layer.cipher)}
          {...preventDoubleClick}
          {...handleHover(Layer.cipher, setHoveredLayer)}
        >
          {(isMobile || hoveredLayer !== Layer.cipher) && (
            <text x="290" y="205" fill={graphTheme.text} fontSize="12px">
              {t('common.cipher')}
            </text>
          )}
          {!isMobile && hoveredLayer === Layer.cipher && !disabledMap[Layer.cipher] && (
            <text x="294" y="205" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              {t('common.view')}
            </text>
          )}
          {!isMobile && hoveredLayer === Layer.cipher && disabledMap[Layer.cipher] && (
            <text x="290" y="205" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
              <LayerNotEnabledLabel network={network} />
            </text>
          )}
        </g>

        {network === Network.testnet && (
          <defs>
            <filter
              id="filter0_di_6093_290291"
              x="114.629"
              y="16.0917"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47451 0 0 0 0 0.313726 0 0 0 0 0 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_290291" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_290291" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_290291" />
            </filter>
            <filter
              id="filter1_di_6093_290291"
              x="42.6287"
              y="224.092"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47451 0 0 0 0 0.313726 0 0 0 0 0 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_290291" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_290291" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_290291" />
            </filter>
            <filter
              id="filter2_di_6093_290291"
              x="225.629"
              y="123.092"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47451 0 0 0 0 0.313726 0 0 0 0 0 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_290291" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_290291" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_290291" />
            </filter>
          </defs>
        )}

        {network === Network.mainnet && (
          <defs>
            <filter
              id="filter0_dii_6093_287252"
              x="114.629"
              y="16.0917"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.135917 0 0 0 0 0 0 0 0 0 0.970833 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_287252" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_287252" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="6.17215" dy="9.87544" />
              <feGaussianBlur stdDeviation="6.17215" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.996078 0 0 0 0 1 0 0 0 0.95 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_287252" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_6093_287252"
                result="effect3_innerShadow_6093_287252"
              />
            </filter>
            <filter
              id="filter1_dii_6093_287252"
              x="42.6287"
              y="224.092"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.135917 0 0 0 0 0 0 0 0 0 0.970833 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_287252" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_287252" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="6.17215" dy="9.87544" />
              <feGaussianBlur stdDeviation="6.17215" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.996078 0 0 0 0 1 0 0 0 0.95 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_287252" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_6093_287252"
                result="effect3_innerShadow_6093_287252"
              />
            </filter>
            <filter
              id="filter2_dii_6093_287252"
              x="225.629"
              y="123.092"
              width="162.147"
              height="162.146"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2.46886" />
              <feGaussianBlur stdDeviation="24.6886" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.135917 0 0 0 0 0 0 0 0 0 0.970833 0 0 0 1 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6093_287252" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6093_287252" result="shape" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="6.17215" dy="9.87544" />
              <feGaussianBlur stdDeviation="6.17215" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.996078 0 0 0 0 1 0 0 0 0.95 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_6093_287252" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.23443" />
              <feGaussianBlur stdDeviation="3.08607" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.58 0" />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_6093_287252"
                result="effect3_innerShadow_6093_287252"
              />
            </filter>
            <linearGradient
              id="paint0_linear_6093_287252"
              x1="164.188"
              y1="82.5885"
              x2="180.881"
              y2="93.5764"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_6093_287252"
              x1="225.045"
              y1="79.419"
              x2="206.45"
              y2="94.4218"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_6093_287252"
              x1="95.1547"
              y1="335.409"
              x2="109.349"
              y2="321.34"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_6093_287252"
              x1="155.753"
              y1="324.162"
              x2="137.454"
              y2="308.801"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_6093_287252"
              x1="78.978"
              y1="278.402"
              x2="100.478"
              y2="288.824"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_6093_287252"
              x1="195.2"
              y1="40.3895"
              x2="196.887"
              y2="64.2225"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02EAE4" />
              <stop offset="1" stopColor="#2C3BD5" />
            </linearGradient>
            <radialGradient
              id="paint6_radial_6093_287252"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(208.634 82.7783) rotate(110.974) scale(65.1743 65.1749)"
            >
              <stop stopColor="#3244E8" />
              <stop offset="1" stopColor="#000210" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="paint7_radial_6093_287252"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(136.634 290.778) rotate(110.974) scale(65.1743 65.1749)"
            >
              <stop stopColor="#3244E8" />
              <stop offset="1" stopColor="#000210" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              id="paint8_radial_6093_287252"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(319.634 189.778) rotate(110.974) scale(65.1743 65.1749)"
            >
              <stop stopColor="#3244E8" />
              <stop offset="1" stopColor="#000210" stopOpacity="0" />
            </radialGradient>
          </defs>
        )}
      </GraphStyled>
    </>
  )
}

export const Graph = memo(forwardRef(GraphCmp))
