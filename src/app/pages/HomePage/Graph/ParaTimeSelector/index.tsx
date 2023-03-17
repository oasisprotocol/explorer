import { FC, memo, useEffect, useRef, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import paratimeSelectorGlow from '../images/paratime-selector-glow.svg'
import paratimeSelectorGlobe from '../images/paratime-selector-globe.svg'
import { Graph } from '../Graph'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from '../types'
import { ParaTimeSelectorUtils } from '../para-time-selector-utils'
import Fade from '@mui/material/Fade'
import useMediaQuery from '@mui/material/useMediaQuery'
import QuickPinchZoom, { make3dTransformValue, UpdateAction } from 'react-quick-pinch-zoom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { GraphUtils } from '../Graph/graph-utils'
import useResizeObserver from 'use-resize-observer'
import HelpScreen from '../HelpScreen'
import { GraphTooltipMobile } from '../GraphTooltip/GraphTooltipMobile'
import { Layer } from '../../../../../oasis-indexer/api'

interface ParaTimeSelectorBaseProps {
  disabled: boolean
}

const ParaTimeSelectorGlow = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !(['disabled'] as (keyof ParaTimeSelectorBaseProps)[]).includes(prop as keyof ParaTimeSelectorBaseProps),
})<ParaTimeSelectorBaseProps>(({ disabled, theme }) => ({
  position: 'relative',
  width: '130vw',
  height: '130vw',
  marginTop: '-10vh',
  backgroundImage: `url("${paratimeSelectorGlow}")`,
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

const ParaTimeSelectorGlobe = styled(Box)(() => ({
  position: 'absolute',
  width: '65%',
  paddingBottom: '65%',
  left: '50%',
  bottom: '6%',
  transform: 'translateX(-50%)',
  backgroundImage: `url("${paratimeSelectorGlobe}")`,
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
ExploreBtn.defaultProps = {
  color: 'secondary',
  variant: 'contained',
}

export const ZoomOutBtn = styled(Button)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '18px',
}))
ZoomOutBtn.defaultProps = {
  variant: 'text',
  color: 'secondary',
  startIcon: <ChevronLeftIcon />,
}
const ZoomOutBtnFade = styled(Fade)(() => ({
  transitionDelay: '500ms !important',
}))

const QuickPinchZoomOuter = styled('div')(() => ({
  '> div': {
    position: 'absolute',
    inset: 0,
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
}

const ParaTimeSelectorCmp: FC<ParaTimeSelectorProps> = ({ disabled, step, setStep }) => {
  const graphRef = useRef<SVGSVGElement & HTMLElement>(null)
  const quickPinchZoomRef = useRef<QuickPinchZoom>(null)
  const quickPinchZoomInnerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const exploreBtnTextTranslated = t('home.exploreBtnText')
  const [activeMobileGraphTooltip, setActiveMobileGraphTooltip] = useState<Layer | null>(null)

  const [selectedLayer, setSelectedLayer] = useState<Layer>()
  const [scale, setScale] = useState<number>(1)

  const { width, height } = useResizeObserver<SVGSVGElement>({
    ref: graphRef,
  })

  useEffect(() => {
    if (selectedLayer) {
      quickPinchZoomRef.current?.scaleTo(GraphUtils.getScaleTo(selectedLayer, { width, height }))
    }
  }, [selectedLayer, width, height])

  useEffect(() => {
    // Switch from mobile -> desktop view while on help screen
    if (!isMobile && step === ParaTimeSelectorStep.ShowHelpScreen) {
      setStep(ParaTimeSelectorStep.Explore)
    }
  }, [isMobile, step, setStep])

  const onExploreClick = () => {
    if (isMobile) {
      setStep(ParaTimeSelectorStep.ShowHelpScreen)
    } else {
      setStep(ParaTimeSelectorStep.Explore)
    }
  }

  const onZoomOutClick = () => {
    setSelectedLayer(Layer.consensus)
  }

  const onPinchZoom = ({ x, y, scale }: UpdateAction) => {
    const transformValue = make3dTransformValue({ x, y, scale })
    setScale(scale)
    quickPinchZoomInnerRef.current?.style.setProperty('transform', transformValue)
  }

  return (
    <>
      <ParaTimeSelectorGlow disabled={disabled}>
        <ParaTimeSelectorGlobe>
          <QuickPinchZoomOuter>
            <QuickPinchZoom ref={quickPinchZoomRef} onUpdate={onPinchZoom} maxZoom={1.5} minZoom={0.5}>
              <QuickPinchZoomInner ref={quickPinchZoomInnerRef}>
                <Graph
                  ref={graphRef}
                  disabled={disabled}
                  transparent={ParaTimeSelectorUtils.getIsGraphTransparent(step)}
                  selectedLayer={selectedLayer}
                  setSelectedLayer={setSelectedLayer}
                  scale={scale}
                  setActiveMobileGraphTooltip={setActiveMobileGraphTooltip}
                />
              </QuickPinchZoomInner>
            </QuickPinchZoom>
          </QuickPinchZoomOuter>
          {!isMobile && (
            <ZoomOutBtnFade in={ParaTimeSelectorUtils.showZoomOutBtn(isMobile, selectedLayer)}>
              <ZoomOutBtn
                onClick={onZoomOutClick}
                disabled={disabled}
                sx={{
                  position: 'absolute',
                  top: theme.spacing(4),
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                {t('home.zoomOutBtnText')}
              </ZoomOutBtn>
            </ZoomOutBtnFade>
          )}
          {ParaTimeSelectorUtils.showExploreBtn(step) && (
            <ExploreBtn
              onClick={onExploreClick}
              aria-label={exploreBtnTextTranslated}
              sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              {t('home.exploreBtnText')}
            </ExploreBtn>
          )}
          {ParaTimeSelectorUtils.showMobileHelpScreen(step, isMobile) && (
            <HelpScreen setParaTimeStep={setStep} />
          )}
        </ParaTimeSelectorGlobe>
      </ParaTimeSelectorGlow>
      {activeMobileGraphTooltip && (
        <GraphTooltipMobile
          layer={activeMobileGraphTooltip}
          onClose={() => {
            setActiveMobileGraphTooltip(null)
          }}
        />
      )}
    </>
  )
}

export const ParaTimeSelector = memo(ParaTimeSelectorCmp)
