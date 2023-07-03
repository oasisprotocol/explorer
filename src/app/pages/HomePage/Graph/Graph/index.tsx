import { Link, useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { forwardRef, ForwardRefRenderFunction, memo, MouseEventHandler, useEffect, useState } from 'react'
import { RouteUtils } from '../../../../utils/route-utils'
import { useScreenSize } from '../../../../hooks/useScreensize'
import { Layer } from '../../../../../oasis-nexus/api'
import { Network } from '../../../../../types/network'
import { COLORS } from '../../../../../styles/theme/testnet/colors'
import { useTranslation } from 'react-i18next'

interface GraphBaseProps {
  disabled?: boolean
  transparent?: boolean
}

interface GraphProps extends GraphBaseProps {
  network: Network
  scale: number
  // TODO: Consider moving this to a state management solution
  selectedLayer?: Layer
  setSelectedLayer: (value: Layer) => void
  setActiveMobileGraphTooltip: (layer: Layer | null) => void
  isZoomedIn: boolean
}

interface GraphSvgProps extends GraphBaseProps {
  hoveredLayer?: Layer
}

const GraphStyled = styled('svg', {
  shouldForwardProp: prop =>
    !(['disabled', 'transparent', 'hoveredLayer'] as (keyof GraphSvgProps)[]).includes(
      prop as keyof GraphSvgProps,
    ),
})<GraphSvgProps>(({ disabled, transparent, hoveredLayer }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
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
  [`g[id$=circle]`]: {
    'ellipse:not(:last-child)': {
      display: 'inline',
    },
    'ellipse:last-child': {
      display: 'none',
    },
    '&:hover, &:focus-visible': {
      'ellipse:not(:last-child)': {
        display: 'none',
      },
      'ellipse:last-child': {
        display: 'inline',
      },
      'circle:not(.no-hide)': {
        display: 'none',
      },
    },
  },
  // TODO: :has not supported in Firefox
  [`g[id$=circle]:has( + g[id$=label]:hover)`]: {
    'ellipse:not(:last-child)': {
      display: 'none',
    },
    'ellipse:last-child': {
      display: 'inline',
    },
    'circle:not(.no-hide)': {
      display: 'none',
    },
  },
  text: {
    'user-select': 'none',
  },
}))

const preventDoubleClick: { onDoubleClick: MouseEventHandler } = {
  onDoubleClick: e => e.preventDefault(),
}

const handleHover: (
  layer: Layer,
  set: (layer: Layer) => void,
) => {
  onMouseEnter: MouseEventHandler
  onMouseLeave: MouseEventHandler
} = (layer: Layer, set: (layer: Layer | null) => void) => ({
  onMouseEnter: () => set(layer),
  onMouseLeave: () => set(null),
})

const GraphCmp: ForwardRefRenderFunction<SVGSVGElement, GraphProps> = (
  {
    disabled = false,
    transparent = false,
    selectedLayer,
    network,
    setSelectedLayer,
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

  useEffect(() => {
    setActiveMobileGraphTooltip(null)
    // should only close tooltips on isMobile change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  const isLayerDisabled = (Layer: Layer) => {
    return !RouteUtils.getEnabledLayersForNetwork(network).includes(Layer)
  }

  const disabledMap: Record<Layer, boolean> = {
    [Layer.emerald]: isLayerDisabled(Layer.emerald),
    [Layer.consensus]: isLayerDisabled(Layer.consensus),
    [Layer.cipher]: isLayerDisabled(Layer.cipher),
    [Layer.sapphire]: isLayerDisabled(Layer.sapphire),
  }

  const onSelectLayer = (layer: Layer) => {
    if (isMobile && isZoomedIn) {
      setSelectedLayer(layer)
      setActiveMobileGraphTooltip(layer)

      return
    }

    if (!isMobile && RouteUtils.getEnabledLayersForNetwork(network).includes(layer)) {
      navigate(RouteUtils.getDashboardRoute({ network, layer }))

      return
    }
  }

  const graphThemes = {
    mainnet: {
      cipherCircle: 'url(#paint7_radial_6093_287252)',
      cipherCircleFilter: 'url(#filter2_dii_6093_287252)',
      cipherCircleFill: COLORS.darkBlue,
      emeraldCircle: 'url(#paint5_radial_6093_287252)',
      emeraldCircleFilter: 'url(#filter0_dii_6093_287252)',
      sapphireCircle: 'url(#paint6_radial_6093_287252)',
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
  }

  const graphTheme = graphThemes[network]

  return (
    <GraphStyled
      width="396"
      height="371"
      viewBox="0 0 396 371"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      disabled={disabled}
      transparent={transparent}
      hoveredLayer={hoveredLayer}
      preserveAspectRatio="xMidYMid slice"
      ref={ref}
    >
      <path
        d="M257.947 202.31C259.1 193.19 258.447 183.932 256.023 175.064C253.598 166.197 249.452 157.894 243.819 150.629C238.186 143.364 231.177 137.28 223.193 132.724C215.208 128.168 206.405 125.229 197.285 124.075C188.164 122.921 178.906 123.575 170.039 125.999C161.172 128.423 152.868 132.57 145.604 138.203C138.339 143.836 132.255 150.844 127.698 158.829C123.142 166.813 120.203 175.617 119.05 184.737C117.896 193.857 118.549 203.115 120.974 211.982C123.398 220.85 127.545 229.153 133.178 236.418C138.811 243.683 145.819 249.767 153.804 254.323C161.788 258.879 170.591 261.818 179.712 262.972C188.832 264.126 198.09 263.472 206.957 261.048C215.825 258.624 224.128 254.477 231.393 248.844C238.657 243.211 244.742 236.202 249.298 228.218C253.854 220.233 256.793 211.43 257.947 202.31L257.947 202.31Z"
        stroke={graphTheme.line}
        strokeWidth="6.16169"
        strokeDasharray="0.27 2.71"
      />
      <path d="M195.673 86.4513L155.947 60.6719" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M195.674 86.4512L235.399 57.9248" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M183.768 194.158L308.693 186.227" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M187.221 196.965L195.884 87.5078" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M167.502 224L132.572 271.516" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M121.083 292.697L87.666 326.253" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M127.501 283.77L163.137 317.266" stroke={graphTheme.line} strokeWidth="2" />
      <path d="M112.336 279.147L69.5934 255.379" stroke={graphTheme.line} strokeWidth="2" />
      <g style={{ pointerEvents: !disabledMap.emerald ? 'auto' : 'none' }}>
        <Link to={RouteUtils.getLatestTransactionsRoute({ network, layer: Layer.emerald })}>
          <path
            d="M139.839 23.333C151.715 23.333 161.341 32.9589 161.341 44.833C161.341 56.7071 151.715 66.333 139.839 66.333C127.964 66.333 118.338 56.7071 118.338 44.833C118.338 32.9589 127.964 23.333 139.839 23.333Z"
            fill={graphTheme.circleBorder}
            stroke={graphTheme.line}
          />
          <path
            d="M126.872 47.833V47.073H128.712C129.152 47.073 129.495 46.9697 129.742 46.763C129.995 46.5497 130.122 46.2597 130.122 45.893C130.122 45.4997 129.979 45.1897 129.692 44.963C129.405 44.7363 129.005 44.6263 128.492 44.633H126.872V43.923H128.082C128.682 43.923 129.195 43.9997 129.622 44.153C130.055 44.3063 130.389 44.533 130.622 44.833C130.855 45.1263 130.972 45.4897 130.972 45.923C130.972 46.3297 130.882 46.6763 130.702 46.963C130.522 47.243 130.265 47.4597 129.932 47.613C129.605 47.7597 129.212 47.833 128.752 47.833H126.872ZM126.252 47.833V40.833H127.092V47.833H126.252ZM126.852 44.653V43.903H128.672C129.059 43.903 129.362 43.7997 129.582 43.593C129.802 43.3863 129.912 43.0997 129.912 42.733C129.912 42.353 129.782 42.0597 129.522 41.853C129.269 41.6463 128.909 41.5463 128.442 41.553H126.852V40.833L128.462 40.823C128.942 40.823 129.352 40.8997 129.692 41.053C130.032 41.1997 130.295 41.4163 130.482 41.703C130.669 41.983 130.762 42.3263 130.762 42.733C130.762 43.1197 130.662 43.4563 130.462 43.743C130.262 44.023 129.979 44.2397 129.612 44.393C129.245 44.5463 128.809 44.623 128.302 44.623L126.852 44.653ZM132.135 47.833V40.833H132.935V47.833H132.135ZM136.543 47.953C136.056 47.953 135.623 47.843 135.243 47.623C134.869 47.3963 134.576 47.0863 134.363 46.693C134.149 46.2997 134.043 45.8463 134.043 45.333C134.043 44.8197 134.146 44.3663 134.353 43.973C134.566 43.5797 134.859 43.273 135.233 43.053C135.613 42.8263 136.043 42.713 136.523 42.713C137.016 42.713 137.449 42.8263 137.823 43.053C138.203 43.273 138.496 43.5797 138.703 43.973C138.916 44.3663 139.023 44.8197 139.023 45.333C139.023 45.8463 138.916 46.2997 138.703 46.693C138.496 47.0863 138.206 47.3963 137.833 47.623C137.459 47.843 137.029 47.953 136.543 47.953ZM136.543 47.213C136.876 47.213 137.166 47.133 137.413 46.973C137.659 46.813 137.853 46.593 137.993 46.313C138.139 46.033 138.213 45.7063 138.213 45.333C138.213 44.9597 138.139 44.633 137.993 44.353C137.853 44.073 137.656 43.853 137.403 43.693C137.149 43.533 136.856 43.453 136.523 43.453C136.196 43.453 135.906 43.533 135.653 43.693C135.406 43.853 135.209 44.073 135.063 44.353C134.923 44.633 134.853 44.9597 134.853 45.333C134.853 45.6997 134.923 46.0263 135.063 46.313C135.209 46.593 135.409 46.813 135.663 46.973C135.923 47.133 136.216 47.213 136.543 47.213ZM142.363 47.953C141.87 47.953 141.433 47.843 141.053 47.623C140.673 47.3963 140.377 47.0863 140.163 46.693C139.95 46.2997 139.843 45.8463 139.843 45.333C139.843 44.8197 139.947 44.3663 140.153 43.973C140.367 43.5797 140.663 43.273 141.043 43.053C141.423 42.8263 141.857 42.713 142.343 42.713C142.823 42.713 143.253 42.823 143.633 43.043C144.013 43.263 144.303 43.573 144.503 43.973L143.773 44.303C143.64 44.0363 143.447 43.8297 143.193 43.683C142.94 43.5297 142.65 43.453 142.323 43.453C141.997 43.453 141.707 43.533 141.453 43.693C141.207 43.853 141.01 44.0763 140.863 44.363C140.723 44.643 140.653 44.9663 140.653 45.333C140.653 45.6997 140.723 46.0263 140.863 46.313C141.01 46.593 141.21 46.813 141.463 46.973C141.723 47.133 142.017 47.213 142.343 47.213C142.67 47.213 142.96 47.1297 143.213 46.963C143.473 46.7963 143.67 46.563 143.803 46.263L144.533 46.593C144.333 47.0197 144.043 47.353 143.663 47.593C143.283 47.833 142.85 47.953 142.363 47.953ZM146.323 46.223L145.813 45.673L148.473 42.833H149.483L146.323 46.223ZM145.543 47.833V40.833H146.343V47.833H145.543ZM148.693 47.833L146.793 44.963L147.313 44.403L149.683 47.833H148.693ZM152.147 47.953C151.78 47.953 151.46 47.8997 151.187 47.793C150.914 47.6797 150.684 47.533 150.497 47.353C150.317 47.173 150.187 46.9763 150.107 46.763L150.807 46.473C150.92 46.6997 151.09 46.883 151.317 47.023C151.544 47.163 151.794 47.233 152.067 47.233C152.38 47.233 152.644 47.173 152.857 47.053C153.07 46.9263 153.177 46.7497 153.177 46.523C153.177 46.3163 153.097 46.1497 152.937 46.023C152.784 45.8963 152.554 45.793 152.247 45.713L151.767 45.583C151.314 45.463 150.96 45.283 150.707 45.043C150.454 44.7963 150.327 44.5197 150.327 44.213C150.327 43.7397 150.48 43.373 150.787 43.113C151.1 42.8463 151.564 42.713 152.177 42.713C152.47 42.713 152.737 42.7563 152.977 42.843C153.217 42.9297 153.424 43.053 153.597 43.213C153.77 43.3663 153.897 43.5497 153.977 43.763L153.277 44.073C153.19 43.8463 153.047 43.683 152.847 43.583C152.647 43.483 152.404 43.433 152.117 43.433C151.81 43.433 151.57 43.4997 151.397 43.633C151.224 43.7597 151.137 43.9397 151.137 44.173C151.137 44.3063 151.207 44.433 151.347 44.553C151.494 44.6663 151.707 44.7597 151.987 44.833L152.487 44.963C152.814 45.043 153.087 45.163 153.307 45.323C153.527 45.4763 153.694 45.653 153.807 45.853C153.92 46.053 153.977 46.2663 153.977 46.493C153.977 46.793 153.897 47.053 153.737 47.273C153.577 47.493 153.36 47.663 153.087 47.783C152.814 47.8963 152.5 47.953 152.147 47.953Z"
            fill={graphTheme.text}
          />
        </Link>
        <Link to={RouteUtils.getLatestBlocksRoute({ network, layer: Layer.emerald })}>
          <path
            d="M250.839 21.333C262.715 21.333 272.341 30.9589 272.341 42.833C272.341 54.7071 262.715 64.333 250.839 64.333C238.964 64.333 229.338 54.7071 229.338 42.833C229.338 30.9589 238.964 21.333 250.839 21.333Z"
            fill={graphTheme.circleBorder}
            stroke={graphTheme.line}
          />
          <path
            d="M243.43 45.833V39.413H244.27V45.833H243.43ZM241.2 39.603V38.833H246.5V39.603H241.2ZM246.707 45.833L248.747 42.963L250.187 40.833H251.137L249.237 43.533L247.677 45.833H246.707ZM250.297 45.833L248.757 43.533L246.837 40.833H247.787L249.237 42.963L251.257 45.833H250.297ZM252.053 45.833V40.833H252.803L252.853 41.753V45.833H252.053ZM255.563 45.833V43.273L256.363 42.973V45.833H255.563ZM255.563 43.273C255.563 42.7797 255.507 42.403 255.393 42.143C255.28 41.883 255.123 41.7063 254.923 41.613C254.723 41.513 254.497 41.463 254.243 41.463C253.803 41.463 253.46 41.6197 253.213 41.933C252.973 42.2397 252.853 42.6763 252.853 43.243H252.463C252.463 42.7163 252.54 42.263 252.693 41.883C252.847 41.503 253.067 41.213 253.353 41.013C253.647 40.813 254 40.713 254.413 40.713C255.02 40.713 255.497 40.8997 255.843 41.273C256.197 41.6463 256.37 42.213 256.363 42.973L255.563 43.273ZM259.379 45.953C259.013 45.953 258.693 45.8997 258.419 45.793C258.146 45.6797 257.916 45.533 257.729 45.353C257.549 45.173 257.419 44.9763 257.339 44.763L258.039 44.473C258.153 44.6997 258.323 44.883 258.549 45.023C258.776 45.163 259.026 45.233 259.299 45.233C259.613 45.233 259.876 45.173 260.089 45.053C260.303 44.9263 260.409 44.7497 260.409 44.523C260.409 44.3163 260.329 44.1497 260.169 44.023C260.016 43.8963 259.786 43.793 259.479 43.713L258.999 43.583C258.546 43.463 258.193 43.283 257.939 43.043C257.686 42.7963 257.559 42.5197 257.559 42.213C257.559 41.7397 257.713 41.373 258.019 41.113C258.333 40.8463 258.796 40.713 259.409 40.713C259.703 40.713 259.969 40.7563 260.209 40.843C260.449 40.9297 260.656 41.053 260.829 41.213C261.003 41.3663 261.129 41.5497 261.209 41.763L260.509 42.073C260.423 41.8463 260.279 41.683 260.079 41.583C259.879 41.483 259.636 41.433 259.349 41.433C259.043 41.433 258.803 41.4997 258.629 41.633C258.456 41.7597 258.369 41.9397 258.369 42.173C258.369 42.3063 258.439 42.433 258.579 42.553C258.726 42.6663 258.939 42.7597 259.219 42.833L259.719 42.963C260.046 43.043 260.319 43.163 260.539 43.323C260.759 43.4763 260.926 43.653 261.039 43.853C261.153 44.053 261.209 44.2663 261.209 44.493C261.209 44.793 261.129 45.053 260.969 45.273C260.809 45.493 260.593 45.663 260.319 45.783C260.046 45.8963 259.733 45.953 259.379 45.953Z"
            fill={graphTheme.text}
          />
        </Link>
      </g>
      <g style={{ pointerEvents: !disabledMap.sapphire ? 'auto' : 'none' }}>
        <Link to={RouteUtils.getLatestBlocksRoute({ network, layer: Layer.sapphire })}>
          <path
            d="M78.8395 315.333C90.7145 315.333 100.341 324.959 100.341 336.833C100.341 348.707 90.7145 358.333 78.8395 358.333C66.9644 358.333 57.3379 348.707 57.3379 336.833C57.3379 324.959 66.9644 315.333 78.8395 315.333Z"
            fill={graphTheme.circleBorder}
            stroke={graphTheme.line}
          />
          <path
            d="M65.872 339.833V339.073H67.712C68.152 339.073 68.4953 338.97 68.742 338.763C68.9953 338.55 69.122 338.26 69.122 337.893C69.122 337.5 68.9786 337.19 68.692 336.963C68.4053 336.736 68.0053 336.626 67.492 336.633H65.872V335.923H67.082C67.682 335.923 68.1953 336 68.622 336.153C69.0553 336.306 69.3886 336.533 69.622 336.833C69.8553 337.126 69.972 337.49 69.972 337.923C69.972 338.33 69.882 338.676 69.702 338.963C69.522 339.243 69.2653 339.46 68.932 339.613C68.6053 339.76 68.212 339.833 67.752 339.833H65.872ZM65.252 339.833V332.833H66.092V339.833H65.252ZM65.852 336.653V335.903H67.672C68.0586 335.903 68.362 335.8 68.582 335.593C68.802 335.386 68.912 335.1 68.912 334.733C68.912 334.353 68.782 334.06 68.522 333.853C68.2686 333.646 67.9086 333.546 67.442 333.553H65.852V332.833L67.462 332.823C67.942 332.823 68.352 332.9 68.692 333.053C69.032 333.2 69.2953 333.416 69.482 333.703C69.6686 333.983 69.762 334.326 69.762 334.733C69.762 335.12 69.662 335.456 69.462 335.743C69.262 336.023 68.9786 336.24 68.612 336.393C68.2453 336.546 67.8086 336.623 67.302 336.623L65.852 336.653ZM71.1352 339.833V332.833H71.9352V339.833H71.1352ZM75.5425 339.953C75.0558 339.953 74.6225 339.843 74.2425 339.623C73.8692 339.396 73.5758 339.086 73.3625 338.693C73.1492 338.3 73.0425 337.846 73.0425 337.333C73.0425 336.82 73.1458 336.366 73.3525 335.973C73.5658 335.58 73.8592 335.273 74.2325 335.053C74.6125 334.826 75.0425 334.713 75.5225 334.713C76.0158 334.713 76.4492 334.826 76.8225 335.053C77.2025 335.273 77.4958 335.58 77.7025 335.973C77.9158 336.366 78.0225 336.82 78.0225 337.333C78.0225 337.846 77.9158 338.3 77.7025 338.693C77.4958 339.086 77.2058 339.396 76.8325 339.623C76.4592 339.843 76.0292 339.953 75.5425 339.953ZM75.5425 339.213C75.8758 339.213 76.1658 339.133 76.4125 338.973C76.6592 338.813 76.8525 338.593 76.9925 338.313C77.1392 338.033 77.2125 337.706 77.2125 337.333C77.2125 336.96 77.1392 336.633 76.9925 336.353C76.8525 336.073 76.6558 335.853 76.4025 335.693C76.1492 335.533 75.8558 335.453 75.5225 335.453C75.1958 335.453 74.9058 335.533 74.6525 335.693C74.4058 335.853 74.2092 336.073 74.0625 336.353C73.9225 336.633 73.8525 336.96 73.8525 337.333C73.8525 337.7 73.9225 338.026 74.0625 338.313C74.2092 338.593 74.4092 338.813 74.6625 338.973C74.9225 339.133 75.2158 339.213 75.5425 339.213ZM81.3633 339.953C80.87 339.953 80.4333 339.843 80.0533 339.623C79.6733 339.396 79.3766 339.086 79.1633 338.693C78.95 338.3 78.8433 337.846 78.8433 337.333C78.8433 336.82 78.9466 336.366 79.1533 335.973C79.3666 335.58 79.6633 335.273 80.0433 335.053C80.4233 334.826 80.8566 334.713 81.3433 334.713C81.8233 334.713 82.2533 334.823 82.6333 335.043C83.0133 335.263 83.3033 335.573 83.5033 335.973L82.7733 336.303C82.64 336.036 82.4466 335.83 82.1933 335.683C81.94 335.53 81.65 335.453 81.3233 335.453C80.9966 335.453 80.7066 335.533 80.4533 335.693C80.2066 335.853 80.01 336.076 79.8633 336.363C79.7233 336.643 79.6533 336.966 79.6533 337.333C79.6533 337.7 79.7233 338.026 79.8633 338.313C80.01 338.593 80.21 338.813 80.4633 338.973C80.7233 339.133 81.0166 339.213 81.3433 339.213C81.67 339.213 81.96 339.13 82.2133 338.963C82.4733 338.796 82.67 338.563 82.8033 338.263L83.5333 338.593C83.3333 339.02 83.0433 339.353 82.6633 339.593C82.2833 339.833 81.85 339.953 81.3633 339.953ZM85.3234 338.223L84.8134 337.673L87.4734 334.833H88.4834L85.3234 338.223ZM84.5434 339.833V332.833H85.3434V339.833H84.5434ZM87.6934 339.833L85.7934 336.963L86.3134 336.403L88.6834 339.833H87.6934ZM91.147 339.953C90.7803 339.953 90.4603 339.9 90.187 339.793C89.9136 339.68 89.6836 339.533 89.497 339.353C89.317 339.173 89.187 338.976 89.107 338.763L89.807 338.473C89.9203 338.7 90.0903 338.883 90.317 339.023C90.5436 339.163 90.7936 339.233 91.067 339.233C91.3803 339.233 91.6436 339.173 91.857 339.053C92.0703 338.926 92.177 338.75 92.177 338.523C92.177 338.316 92.097 338.15 91.937 338.023C91.7836 337.896 91.5536 337.793 91.247 337.713L90.767 337.583C90.3136 337.463 89.9603 337.283 89.707 337.043C89.4536 336.796 89.327 336.52 89.327 336.213C89.327 335.74 89.4803 335.373 89.787 335.113C90.1003 334.846 90.5636 334.713 91.177 334.713C91.4703 334.713 91.737 334.756 91.977 334.843C92.217 334.93 92.4236 335.053 92.597 335.213C92.7703 335.366 92.897 335.55 92.977 335.763L92.277 336.073C92.1903 335.846 92.047 335.683 91.847 335.583C91.647 335.483 91.4036 335.433 91.117 335.433C90.8103 335.433 90.5703 335.5 90.397 335.633C90.2236 335.76 90.137 335.94 90.137 336.173C90.137 336.306 90.207 336.433 90.347 336.553C90.4936 336.666 90.707 336.76 90.987 336.833L91.487 336.963C91.8136 337.043 92.087 337.163 92.307 337.323C92.527 337.476 92.6936 337.653 92.807 337.853C92.9203 338.053 92.977 338.266 92.977 338.493C92.977 338.793 92.897 339.053 92.737 339.273C92.577 339.493 92.3603 339.663 92.087 339.783C91.8136 339.896 91.5003 339.953 91.147 339.953Z"
            fill={graphTheme.text}
          />
        </Link>
        <Link to={RouteUtils.getLatestTransactionsRoute({ network, layer: Layer.sapphire })}>
          <path
            d="M176.839 307.333C188.715 307.333 198.341 316.959 198.341 328.833C198.341 340.707 188.715 350.333 176.839 350.333C164.964 350.333 155.338 340.707 155.338 328.833C155.338 316.959 164.964 307.333 176.839 307.333Z"
            fill={graphTheme.circleBorder}
            stroke={graphTheme.line}
          />
          <path
            d="M169.43 331.833V325.413H170.27V331.833H169.43ZM167.2 325.603V324.833H172.5V325.603H167.2ZM172.707 331.833L174.747 328.963L176.187 326.833H177.137L175.237 329.533L173.677 331.833H172.707ZM176.297 331.833L174.757 329.533L172.837 326.833H173.787L175.237 328.963L177.257 331.833H176.297ZM178.053 331.833V326.833H178.803L178.853 327.753V331.833H178.053ZM181.563 331.833V329.273L182.363 328.973V331.833H181.563ZM181.563 329.273C181.563 328.78 181.507 328.403 181.393 328.143C181.28 327.883 181.123 327.706 180.923 327.613C180.723 327.513 180.497 327.463 180.243 327.463C179.803 327.463 179.46 327.62 179.213 327.933C178.973 328.24 178.853 328.676 178.853 329.243H178.463C178.463 328.716 178.54 328.263 178.693 327.883C178.847 327.503 179.067 327.213 179.353 327.013C179.647 326.813 180 326.713 180.413 326.713C181.02 326.713 181.497 326.9 181.843 327.273C182.197 327.646 182.37 328.213 182.363 328.973L181.563 329.273ZM185.379 331.953C185.013 331.953 184.693 331.9 184.419 331.793C184.146 331.68 183.916 331.533 183.729 331.353C183.549 331.173 183.419 330.976 183.339 330.763L184.039 330.473C184.153 330.7 184.323 330.883 184.549 331.023C184.776 331.163 185.026 331.233 185.299 331.233C185.613 331.233 185.876 331.173 186.089 331.053C186.303 330.926 186.409 330.75 186.409 330.523C186.409 330.316 186.329 330.15 186.169 330.023C186.016 329.896 185.786 329.793 185.479 329.713L184.999 329.583C184.546 329.463 184.193 329.283 183.939 329.043C183.686 328.796 183.559 328.52 183.559 328.213C183.559 327.74 183.713 327.373 184.019 327.113C184.333 326.846 184.796 326.713 185.409 326.713C185.703 326.713 185.969 326.756 186.209 326.843C186.449 326.93 186.656 327.053 186.829 327.213C187.003 327.366 187.129 327.55 187.209 327.763L186.509 328.073C186.423 327.846 186.279 327.683 186.079 327.583C185.879 327.483 185.636 327.433 185.349 327.433C185.043 327.433 184.803 327.5 184.629 327.633C184.456 327.76 184.369 327.94 184.369 328.173C184.369 328.306 184.439 328.433 184.579 328.553C184.726 328.666 184.939 328.76 185.219 328.833L185.719 328.963C186.046 329.043 186.319 329.163 186.539 329.323C186.759 329.476 186.926 329.653 187.039 329.853C187.153 330.053 187.209 330.266 187.209 330.493C187.209 330.793 187.129 331.053 186.969 331.273C186.809 331.493 186.593 331.663 186.319 331.783C186.046 331.896 185.733 331.953 185.379 331.953Z"
            fill={graphTheme.text}
          />
        </Link>
        <Link to={RouteUtils.getTopTokensRoute({ network, layer: Layer.sapphire })}>
          <path
            d="M65.8395 229.333C77.7145 229.333 87.3411 238.959 87.3411 250.833C87.3411 262.707 77.7145 272.333 65.8395 272.333C53.9644 272.333 44.3379 262.707 44.3379 250.833C44.3379 238.959 53.9644 229.333 65.8395 229.333Z"
            fill={graphTheme.circleBorder}
            stroke={graphTheme.line}
          />
          <path
            d="M52.6072 253.833V247.413H53.4472V253.833H52.6072ZM50.3772 247.603V246.833H55.6772V247.603H50.3772ZM58.0796 253.953C57.5929 253.953 57.1596 253.843 56.7796 253.623C56.4062 253.396 56.1129 253.086 55.8996 252.693C55.6862 252.3 55.5796 251.846 55.5796 251.333C55.5796 250.82 55.6829 250.366 55.8896 249.973C56.1029 249.58 56.3962 249.273 56.7696 249.053C57.1496 248.826 57.5796 248.713 58.0596 248.713C58.5529 248.713 58.9862 248.826 59.3596 249.053C59.7396 249.273 60.0329 249.58 60.2396 249.973C60.4529 250.366 60.5596 250.82 60.5596 251.333C60.5596 251.846 60.4529 252.3 60.2396 252.693C60.0329 253.086 59.7429 253.396 59.3696 253.623C58.9962 253.843 58.5662 253.953 58.0796 253.953ZM58.0796 253.213C58.4129 253.213 58.7029 253.133 58.9496 252.973C59.1962 252.813 59.3896 252.593 59.5296 252.313C59.6762 252.033 59.7496 251.706 59.7496 251.333C59.7496 250.96 59.6762 250.633 59.5296 250.353C59.3896 250.073 59.1929 249.853 58.9396 249.693C58.6862 249.533 58.3929 249.453 58.0596 249.453C57.7329 249.453 57.4429 249.533 57.1896 249.693C56.9429 249.853 56.7462 250.073 56.5996 250.353C56.4596 250.633 56.3896 250.96 56.3896 251.333C56.3896 251.7 56.4596 252.026 56.5996 252.313C56.7462 252.593 56.9462 252.813 57.1996 252.973C57.4596 253.133 57.7529 253.213 58.0796 253.213ZM62.4503 252.223L61.9403 251.673L64.6003 248.833H65.6103L62.4503 252.223ZM61.6703 253.833V246.833H62.4703V253.833H61.6703ZM64.8203 253.833L62.9203 250.963L63.4403 250.403L65.8103 253.833H64.8203ZM68.6064 253.953C68.1198 253.953 67.6898 253.843 67.3164 253.623C66.9431 253.396 66.6498 253.086 66.4364 252.693C66.2298 252.3 66.1264 251.846 66.1264 251.333C66.1264 250.82 66.2298 250.366 66.4364 249.973C66.6498 249.58 66.9398 249.273 67.3064 249.053C67.6798 248.826 68.1064 248.713 68.5864 248.713C69.0464 248.713 69.4464 248.83 69.7864 249.063C70.1331 249.29 70.3998 249.61 70.5864 250.023C70.7731 250.436 70.8664 250.923 70.8664 251.483H70.0664C70.0664 251.056 70.0098 250.693 69.8964 250.393C69.7831 250.086 69.6131 249.85 69.3864 249.683C69.1664 249.516 68.8964 249.433 68.5764 249.433C68.2498 249.433 67.9598 249.513 67.7064 249.673C67.4598 249.826 67.2698 250.046 67.1364 250.333C67.0031 250.62 66.9364 250.956 66.9364 251.343C66.9364 251.723 67.0098 252.053 67.1564 252.333C67.3031 252.606 67.5064 252.823 67.7664 252.983C68.0264 253.136 68.3198 253.213 68.6464 253.213C68.9931 253.213 69.2864 253.13 69.5264 252.963C69.7664 252.796 69.9564 252.58 70.0964 252.313L70.7964 252.663C70.6698 252.923 70.4998 253.15 70.2864 253.343C70.0798 253.536 69.8331 253.686 69.5464 253.793C69.2664 253.9 68.9531 253.953 68.6064 253.953ZM66.6564 251.483L66.6664 250.793H70.3764V251.483H66.6564ZM71.8754 253.833V248.833H72.6254L72.6754 249.753V253.833H71.8754ZM75.3854 253.833V251.273L76.1854 250.973V253.833H75.3854ZM75.3854 251.273C75.3854 250.78 75.3287 250.403 75.2154 250.143C75.1021 249.883 74.9454 249.706 74.7454 249.613C74.5454 249.513 74.3187 249.463 74.0654 249.463C73.6254 249.463 73.2821 249.62 73.0354 249.933C72.7954 250.24 72.6754 250.676 72.6754 251.243H72.2854C72.2854 250.716 72.3621 250.263 72.5154 249.883C72.6687 249.503 72.8887 249.213 73.1754 249.013C73.4687 248.813 73.8221 248.713 74.2354 248.713C74.8421 248.713 75.3187 248.9 75.6654 249.273C76.0187 249.646 76.1921 250.213 76.1854 250.973L75.3854 251.273ZM79.2016 253.953C78.8349 253.953 78.5149 253.9 78.2416 253.793C77.9683 253.68 77.7383 253.533 77.5516 253.353C77.3716 253.173 77.2416 252.976 77.1616 252.763L77.8616 252.473C77.9749 252.7 78.1449 252.883 78.3716 253.023C78.5983 253.163 78.8483 253.233 79.1216 253.233C79.4349 253.233 79.6983 253.173 79.9116 253.053C80.1249 252.926 80.2316 252.75 80.2316 252.523C80.2316 252.316 80.1516 252.15 79.9916 252.023C79.8383 251.896 79.6083 251.793 79.3016 251.713L78.8216 251.583C78.3683 251.463 78.0149 251.283 77.7616 251.043C77.5083 250.796 77.3816 250.52 77.3816 250.213C77.3816 249.74 77.5349 249.373 77.8416 249.113C78.1549 248.846 78.6183 248.713 79.2316 248.713C79.5249 248.713 79.7916 248.756 80.0316 248.843C80.2716 248.93 80.4783 249.053 80.6516 249.213C80.8249 249.366 80.9516 249.55 81.0316 249.763L80.3316 250.073C80.2449 249.846 80.1016 249.683 79.9016 249.583C79.7016 249.483 79.4583 249.433 79.1716 249.433C78.8649 249.433 78.6249 249.5 78.4516 249.633C78.2783 249.76 78.1916 249.94 78.1916 250.173C78.1916 250.306 78.2616 250.433 78.4016 250.553C78.5483 250.666 78.7616 250.76 79.0416 250.833L79.5416 250.963C79.8683 251.043 80.1416 251.163 80.3616 251.323C80.5816 251.476 80.7483 251.653 80.8616 251.853C80.9749 252.053 81.0316 252.266 81.0316 252.493C81.0316 252.793 80.9516 253.053 80.7916 253.273C80.6316 253.493 80.4149 253.663 80.1416 253.783C79.8683 253.896 79.5549 253.953 79.2016 253.953Z"
            fill={graphTheme.text}
          />
        </Link>
      </g>
      <g
        id={`${Layer.emerald}-circle`}
        aria-disabled={disabledMap[Layer.emerald]}
        onClick={() => onSelectLayer(Layer.emerald)}
        filter={graphTheme.emeraldCircleFilter}
        {...preventDoubleClick}
        {...handleHover(Layer.emerald, setHoveredLayer)}
      >
        {network === Network.mainnet && (
          <ellipse cx="195.702" cy="78.6959" rx="31.6963" ry="31.6959" fill="#030092" />
        )}
        <ellipse cx="195.702" cy="78.6959" rx="31.6963" ry="31.6959" fill={graphTheme.emeraldCircle} />
        <ellipse cx="195.702" cy="78.6959" rx="31.6963" ry="31.6959" fill={graphTheme.hoverBackground} />
      </g>
      <g
        id={`${Layer.emerald}-label`}
        aria-disabled={disabledMap[Layer.emerald]}
        onClick={() => onSelectLayer(Layer.emerald)}
        {...preventDoubleClick}
        {...handleHover(Layer.emerald, setHoveredLayer)}
      >
        {hoveredLayer !== Layer.emerald && (
          <text x="174.4" y="83" fill={graphTheme.text} fontSize="12px">
            {t('common.emerald')}
          </text>
        )}
        {hoveredLayer === Layer.emerald && !disabledMap[Layer.emerald] && (
          <text x="181.5" y="83" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            {t('common.view')}
          </text>
        )}
        {hoveredLayer === Layer.emerald && disabledMap[Layer.emerald] && (
          <text x="177.4" y="83" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            <tspan dx="-4" dy="-5">
              {t('common.coming')}
            </tspan>
            <tspan dx="-35" dy="12">
              {t('common.soon')}
            </tspan>
          </text>
        )}
      </g>
      <g
        id={`${Layer.sapphire}-circle`}
        aria-disabled={disabledMap[Layer.sapphire]}
        onClick={() => onSelectLayer(Layer.sapphire)}
        filter={graphTheme.sapphireCircleFilter}
        {...preventDoubleClick}
        {...handleHover(Layer.sapphire, setHoveredLayer)}
      >
        {network === Network.mainnet && (
          <ellipse cx="123.702" cy="286.696" rx="31.6963" ry="31.6959" fill="#030092" />
        )}
        <ellipse cx="123.702" cy="286.696" rx="31.6963" ry="31.6959" fill={graphTheme.sapphireCircle} />
        <ellipse cx="123.702" cy="286.696" rx="31.6963" ry="31.6959" fill={graphTheme.hoverBackground} />
      </g>
      <g
        id={`${Layer.sapphire}-label`}
        aria-disabled={disabledMap[Layer.sapphire]}
        onClick={() => onSelectLayer(Layer.sapphire)}
        {...preventDoubleClick}
        {...handleHover(Layer.sapphire, setHoveredLayer)}
      >
        {hoveredLayer !== Layer.sapphire && (
          <text x="100" y="290" fill={graphTheme.text} fontSize="12px">
            {t('common.sapphire')}
          </text>
        )}
        {hoveredLayer === Layer.sapphire && !disabledMap[Layer.sapphire] && (
          <text x="108.5" y="290" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            {t('common.view')}
          </text>
        )}
        {hoveredLayer === Layer.sapphire && disabledMap[Layer.sapphire] && (
          <text x="106" y="290" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            <tspan dx="-4" dy="-5">
              {t('common.coming')}
            </tspan>
            <tspan dx="-35" dy="12">
              {t('common.soon')}
            </tspan>
          </text>
        )}
      </g>
      <g
        id={`${Layer.consensus}-circle`}
        onClick={() => onSelectLayer(Layer.consensus)}
        aria-disabled={disabledMap[Layer.consensus]}
        {...handleHover(Layer.consensus, setHoveredLayer)}
      >
        <circle
          className="no-hide"
          opacity="0.25"
          cx="188.995"
          cy="193.993"
          r="52.9926"
          transform="rotate(-90 188.995 193.993)"
          fill={graphTheme.line}
          {...preventDoubleClick}
        />
        <circle
          cx="188.502"
          cy="193.5"
          r="42.5"
          transform="rotate(-90 188.502 193.5)"
          fill={graphTheme.line}
          {...preventDoubleClick}
        />
        <circle
          cx="189.002"
          cy="194"
          r="36"
          transform="rotate(-90 189.002 194)"
          fill={graphTheme.consensusCircle}
          {...preventDoubleClick}
        />
        <ellipse
          cx="188.502"
          cy="193.5"
          rx="42.5"
          ry="42.5"
          transform="rotate(-90 188.995 193.993)"
          fill={graphTheme.hoverBackground}
        />
      </g>
      <g
        id={`${Layer.consensus}-label`}
        aria-disabled={disabledMap[Layer.consensus]}
        onClick={() => onSelectLayer(Layer.consensus)}
        {...preventDoubleClick}
        {...handleHover(Layer.consensus, setHoveredLayer)}
      >
        {hoveredLayer !== Layer.consensus && (
          <text x="161" y="198" fill={graphTheme.text} fontSize="12px">
            {t('common.consensus')}
          </text>
        )}
        {hoveredLayer === Layer.consensus && !disabledMap[Layer.consensus] && (
          <text x="173" y="199" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            {t('common.view')}
          </text>
        )}
        {hoveredLayer === Layer.consensus && disabledMap[Layer.consensus] && (
          <text x="170" y="198" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            <tspan dx="-4" dy="-5">
              {t('common.coming')}
            </tspan>
            <tspan dx="-35" dy="12">
              {t('common.soon')}
            </tspan>
          </text>
        )}
      </g>
      <g
        filter={graphTheme.cipherCircleFilter}
        aria-disabled={disabledMap[Layer.cipher]}
        onClick={() => onSelectLayer(Layer.cipher)}
        id={`${Layer.cipher}-circle`}
        {...preventDoubleClick}
        {...handleHover(Layer.cipher, setHoveredLayer)}
      >
        <ellipse cx="306.702" cy="185.696" rx="31.6963" ry="31.6959" fill={graphTheme.cipherCircleFill} />
        {network === Network.mainnet && (
          <ellipse cx="306.702" cy="185.696" rx="31.6963" ry="31.6959" fill={graphTheme.cipherCircle} />
        )}
        <ellipse cx="306.702" cy="185.696" rx="31.6963" ry="31.6959" fill={graphTheme.hoverBackground} />
      </g>
      <g
        id={`${Layer.cipher}-label`}
        aria-disabled={disabledMap[Layer.cipher]}
        onClick={() => onSelectLayer(Layer.cipher)}
        {...preventDoubleClick}
        {...handleHover(Layer.cipher, setHoveredLayer)}
      >
        {hoveredLayer !== Layer.cipher && (
          <text x="290" y="190" fill={graphTheme.text} fontSize="12px">
            {t('common.cipher')}
          </text>
        )}
        {hoveredLayer === Layer.cipher && !disabledMap[Layer.cipher] && (
          <text x="293" y="190" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            {t('common.view')}
          </text>
        )}
        {hoveredLayer === Layer.cipher && disabledMap[Layer.cipher] && (
          <text x="290" y="190" fill={graphTheme.hoverText} fontSize="12px" fontWeight="700">
            <tspan dx="-4" dy="-5">
              {t('common.coming')}
            </tspan>
            <tspan dx="-35" dy="12">
              {t('common.soon')}
            </tspan>
          </text>
        )}
      </g>

      <defs>
        <filter
          id="filter0_dii_6093_287252"
          x="114.629"
          y="0.091677"
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
          id="filter0_di_6093_290291"
          x="114.629"
          y="0.091677"
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
          y="208.092"
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
          id="filter1_dii_6093_287252"
          x="42.6287"
          y="208.092"
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
          y="107.092"
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
          id="filter2_di_6093_290291"
          x="225.629"
          y="107.092"
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
        <linearGradient
          id="paint0_linear_6093_287252"
          x1="164.188"
          y1="66.5885"
          x2="180.881"
          y2="77.5764"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#02EAE4" />
          <stop offset="1" stopColor="#2C3BD5" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_6093_287252"
          x1="225.045"
          y1="63.4188"
          x2="206.45"
          y2="78.4215"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#02EAE4" />
          <stop offset="1" stopColor="#2C3BD5" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_6093_287252"
          x1="95.1547"
          y1="319.409"
          x2="109.349"
          y2="305.34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#02EAE4" />
          <stop offset="1" stopColor="#2C3BD5" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_6093_287252"
          x1="155.753"
          y1="308.162"
          x2="137.454"
          y2="292.801"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#02EAE4" />
          <stop offset="1" stopColor="#2C3BD5" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_6093_287252"
          x1="78.978"
          y1="262.401"
          x2="100.478"
          y2="272.824"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#02EAE4" />
          <stop offset="1" stopColor="#2C3BD5" />
        </linearGradient>
        <radialGradient
          id="paint5_radial_6093_287252"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(208.634 66.7783) rotate(110.974) scale(65.1743 65.1749)"
        >
          <stop stopColor="#3244E8" />
          <stop offset="1" stopColor="#000210" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="paint6_radial_6093_287252"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(136.634 274.778) rotate(110.974) scale(65.1743 65.1749)"
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
          gradientTransform="translate(319.634 173.778) rotate(110.974) scale(65.1743 65.1749)"
        >
          <stop stopColor="#3244E8" />
          <stop offset="1" stopColor="#000210" stopOpacity="0" />
        </radialGradient>
      </defs>
    </GraphStyled>
  )
}

export const Graph = memo(forwardRef(GraphCmp))
