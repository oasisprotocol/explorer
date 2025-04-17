import { FC, memo, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import paratimeSelectorGlow from '../images/paratime-selector-glow.svg'
import paratimeSelectorGlobe from '../images/paratime-selector-globe.svg'
import paratimeSelectorGlowTestnet from '../images/paratime-selector-glow-testnet.svg'
import paratimeSelectorGlobeTestnet from '../images/paratime-selector-globe-testnet.svg'
import { Graph } from '../Graph'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from '../types'
import { ParaTimeSelectorUtils } from '../para-time-selector-utils'
import Fade from '@mui/material/Fade'
import { useScreenSize } from '../../../../hooks/useScreensize'
import QuickPinchZoom, { make3dTransformValue, UpdateAction } from 'react-quick-pinch-zoom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { GraphUtils } from '../Graph/graph-utils'
import useResizeObserver from 'use-resize-observer'
import HelpScreen from '../HelpScreen'
import { NetworkSelector } from '../NetworkSelector'
import { Layer } from '../../../../../oasis-nexus/api'
import { Network } from '../../../../../types/network'
import { useSearchQueryNetworkParam } from '../../../../hooks/useSearchQueryNetworkParam'
import { storage } from '../../../../utils/storage'
import { StorageKeys } from '../../../../../types/storage'
import { GraphTooltipMobile } from '../GraphTooltipMobile'
import { fixedNetwork } from '../../../../utils/route-utils'

interface ParaTimeSelectorBaseProps {
  disabled: boolean
}

type ParaTimeSelectorGlowProps = ParaTimeSelectorBaseProps & { network: Network }

const ParaTimeSelectorGlow = styled(Box, {
  shouldForwardProp: prop => prop !== 'disabled' && prop !== 'network',
})<ParaTimeSelectorGlowProps>(({ disabled, network, theme }) => ({
  position: 'relative',
  width: '130vw',
  height: '130vw',
  marginTop: '-5vh',
  backgroundImage: `url("${
    network === Network.testnet ? paratimeSelectorGlowTestnet : paratimeSelectorGlow
  }")`,
  transitionProperty: 'background-image',
  transitionDuration: `${theme.transitions.duration.complex}ms`,
  transitionTimingFunction: theme.transitions.easing.easeInOut,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  ...(disabled
    ? {
        opacity: 0.25,
      }
    : {}),
  [theme.breakpoints.up('sm')]: {
    width: '80vh',
    height: '80vh',
    marginTop: '-17vh',
  },
}))

type ParaTimeSelectorGlobeProps = {
  network: Network
}

const ParaTimeSelectorGlobe = styled(Box, {
  shouldForwardProp: prop => prop !== 'network',
})<ParaTimeSelectorGlobeProps>(({ network, theme }) => ({
  position: 'absolute',
  width: '65%',
  paddingBottom: '65%',
  left: '50%',
  bottom: '6%',
  transform: 'translateX(-50%)',
  color: theme.palette.layout.main,
  backgroundImage: `url("${
    network === Network.testnet || network === Network.localnet
      ? paratimeSelectorGlobeTestnet
      : paratimeSelectorGlobe
  }")`,
  transitionProperty: 'background-image',
  transitionDuration: `${theme.transitions.duration.complex}ms`,
  transitionTimingFunction: theme.transitions.easing.easeInOut,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
  borderRadius: '50%',
}))

export const ExploreBtn = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  width: 'max-content',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
}))

export const ZoomOutBtn = styled(Button)(({ theme }) => ({
  color: theme.palette.layout.graphZoomOutText,
  position: 'absolute',
  top: theme.spacing(5),
  left: '50%',
  transform: 'translateX(-50%)',
  lineHeight: '18px',
  textTransform: 'none',
  '&&:hover, &&:active': {
    color: theme.palette.layout.graphZoomOutText,
    textDecoration: 'none',
  },
  '&&': {
    backgroundColor: 'transparent',
  },
}))

const ZoomOutBtnFade = styled(Fade)(() => ({
  transitionDelay: '500ms !important',
}))

// border affecting scale (quick-pinch-zoom)
const QuickPinchZoomOuter = styled('div')(({ theme }) => ({
  '> div': {
    position: 'absolute',
    inset: 0,
    borderWidth: 10,
    borderStyle: 'solid',
    borderRadius: '50%',
    borderColor: theme.palette.layout.darkBorder,
  },
  [theme.breakpoints.up('sm')]: {
    '> div': {
      borderWidth: 15,
    },
  },
}))

const QuickPinchZoomInner = styled('div')(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
}))

interface ParaTimeSelectorProps extends ParaTimeSelectorBaseProps {
  step: ParaTimeSelectorStep
  setStep: (value: ParaTimeSelectorStep) => void
  showInfoScreen: boolean
  graphZoomedIn: boolean
  onGraphZoomedIn: (isGraphZoomedIn: boolean) => void
}

const localStore = storage()

// This is a special area used to indicate that we should zoom out,
// and see the whole universe.
export const UniverseArea = 'Universe'

export type SelectorArea =
  | typeof UniverseArea
  | typeof Layer.consensus
  | typeof Layer.cipher
  | typeof Layer.emerald
  | typeof Layer.sapphire

const ParaTimeSelectorCmp: FC<ParaTimeSelectorProps> = ({
  disabled,
  step,
  setStep,
  showInfoScreen,
  graphZoomedIn,
  onGraphZoomedIn,
}) => {
  const graphRef = useRef<SVGSVGElement & HTMLElement>(null)
  const quickPinchZoomRef = useRef<QuickPinchZoom>(null)
  const quickPinchZoomInnerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useScreenSize()
  const { t } = useTranslation()
  const exploreBtnTextTranslated = t('home.exploreBtnText')
  const { network, setNetwork } = useSearchQueryNetworkParam()

  // Using object here to force side effect trigger when setting to the same area
  const [selectedArea, setSelectedArea] = useState<{ current: SelectorArea }>()
  const [activeMobileGraphTooltip, setActiveMobileGraphTooltip] = useState<{ current: SelectorArea | null }>({
    current: null,
  })

  const [scale, setScale] = useState<number>(1)

  const { width, height } = useResizeObserver<SVGSVGElement>({
    ref: graphRef,
  })

  useEffect(() => {
    if (selectedArea) {
      quickPinchZoomRef.current?.scaleTo(GraphUtils.getScaleTo(selectedArea.current, { width, height }))
    }
  }, [selectedArea, width, height])

  useEffect(() => {
    // Switch from mobile -> desktop view while on help screen
    if (!isMobile && step === ParaTimeSelectorStep.ShowHelpScreen) {
      setStep(ParaTimeSelectorStep.Explore)
    }
  }, [isMobile, step, setStep])

  const onExploreClick = () => {
    const mobileHelpScreenShown = localStore.get(StorageKeys.MobileHelpScreenShown)

    if (!mobileHelpScreenShown) {
      setStep(ParaTimeSelectorStep.ShowHelpScreen)
    } else {
      setStep(ParaTimeSelectorStep.Explore)
    }
  }

  const onZoomOutClick = () => {
    setSelectedArea({ current: UniverseArea })
  }

  const onPinchZoom = ({ x, y, scale }: UpdateAction) => {
    if (step !== ParaTimeSelectorStep.Explore) {
      return
    }

    const transformValue = make3dTransformValue({ x, y, scale })
    setScale(scale)
    quickPinchZoomInnerRef.current?.style.setProperty('transform', transformValue)
  }

  const clearSelectedArea = () => {
    if (selectedArea?.current) {
      setSelectedArea(undefined)
    }
  }

  useEffect(() => {
    // true when scale larger than "safe" zoom, due to viewport
    const isZoomedIn = scale > 1.5

    onGraphZoomedIn(isZoomedIn)
  }, [scale, onGraphZoomedIn])

  return (
    <>
      <ParaTimeSelectorGlow disabled={disabled} network={network}>
        <ParaTimeSelectorGlobe network={network}>
          <QuickPinchZoomOuter>
            <QuickPinchZoom
              ref={quickPinchZoomRef}
              onUpdate={onPinchZoom}
              maxZoom={2.5}
              minZoom={0.5}
              onDragEnd={clearSelectedArea}
            >
              <QuickPinchZoomInner ref={quickPinchZoomInnerRef}>
                <Graph
                  ref={graphRef}
                  network={network}
                  disabled={disabled}
                  transparent={ParaTimeSelectorUtils.getIsGraphTransparent(step)}
                  selectedArea={selectedArea?.current}
                  setSelectedArea={(area: SelectorArea) => setSelectedArea({ current: area })}
                  scale={scale}
                  setActiveMobileGraphTooltip={setActiveMobileGraphTooltip}
                  isZoomedIn={graphZoomedIn}
                />
              </QuickPinchZoomInner>
            </QuickPinchZoom>
          </QuickPinchZoomOuter>
          {!isMobile && (
            <ZoomOutBtnFade in={graphZoomedIn}>
              <ZoomOutBtn
                color="primary"
                variant="text"
                startIcon={<ChevronLeftIcon />}
                onClick={onZoomOutClick}
                disabled={disabled}
              >
                {t('home.zoomOutBtnText')}
              </ZoomOutBtn>
            </ZoomOutBtnFade>
          )}
          {isMobile && ParaTimeSelectorUtils.showExploreBtn(step) && (
            <ExploreBtn
              color="secondary"
              variant="contained"
              onClick={onExploreClick}
              aria-label={exploreBtnTextTranslated}
              sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {t('home.exploreBtnText')}
            </ExploreBtn>
          )}
          {ParaTimeSelectorUtils.showMobileHelpScreen(step, isMobile, showInfoScreen) && (
            <HelpScreen setParaTimeStep={setStep} />
          )}
        </ParaTimeSelectorGlobe>
        {!fixedNetwork && step === ParaTimeSelectorStep.Explore && (
          <NetworkSelector network={network} setNetwork={network => setNetwork(network ?? Network.mainnet)} />
        )}
      </ParaTimeSelectorGlow>
      {activeMobileGraphTooltip.current && (
        <GraphTooltipMobile
          network={network}
          area={activeMobileGraphTooltip.current}
          onClose={() => {
            setActiveMobileGraphTooltip({ current: null })
          }}
        />
      )}
    </>
  )
}

export const ParaTimeSelector = memo(ParaTimeSelectorCmp)
