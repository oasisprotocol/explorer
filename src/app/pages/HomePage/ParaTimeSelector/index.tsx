import { FC, memo, useCallback, useRef, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import paratimeSelectorGlow from './images/paratime-selector-glow.svg'
import paratimeSelectorGlobe from './images/paratime-selector-globe.svg'
import { Graph } from './Graph'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from './types'
import { ParaTimeSelectorUtils } from './para-time-selector-utils'
import { GraphEndpoint } from './Graph/types'
import Fade from '@mui/material/Fade'
import useMediaQuery from '@mui/material/useMediaQuery'
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom'
import { UpdateAction } from 'react-quick-pinch-zoom/esm/PinchZoom/types'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

interface ParaTimeSelectorProps {
  disabled: boolean
}

const ParaTimeSelectorGlow = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !(['disabled'] as (keyof ParaTimeSelectorProps)[]).includes(prop as keyof ParaTimeSelectorProps),
})<ParaTimeSelectorProps>(({ disabled }) => ({
  position: 'relative',
  width: '80vh',
  height: '80vh',
  marginTop: '-17vh',
  backgroundImage: `url("${paratimeSelectorGlow}")`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  ...(disabled
    ? {
        opacity: 0.25,
      }
    : {}),
}))

const ParaTimeSelectorGlobe = styled(Box)(() => ({
  position: 'absolute',
  width: '65%',
  paddingBottom: '65%',
  left: '50%',
  bottom: '8%',
  transform: 'translateX(-50%)',
  backgroundImage: `url("${paratimeSelectorGlobe}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
  borderRadius: '50%',
}))

const ExploreBtn = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
  width: 'max-content',
}))

const ZoomOutBtn = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
}))

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

const ParaTimeSelectorCmp: FC<ParaTimeSelectorProps> = ({ disabled }) => {
  const graphRef = useRef<any>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  const exploreBtnTextTranslated = t('home.exploreBtnText')

  const [step, setStep] = useState<ParaTimeSelectorStep>(ParaTimeSelectorStep.ENABLE_EXPLORE)
  const [selectedGraphEndpoint, setSelectedGraphEndpoint] = useState<GraphEndpoint>(GraphEndpoint.CONSENSUS)

  const onExploreClick = () => {
    setStep(ParaTimeSelectorStep.EXPLORE)
  }

  const onZoomOutClick = () => {
    setSelectedGraphEndpoint(GraphEndpoint.CONSENSUS)
  }

  const onUpdate = useCallback(({ x, y, scale }: UpdateAction) => {
    console.log('{ x, y, scale }', { x, y, scale })
    const { current } = graphRef

    if (current) {
      const value = make3dTransformValue({ x, y, scale })

      current.style.setProperty('transform', value)
      console.log('transform', value)
    }
  }, [])

  const graphCmp = (
    <Graph
      disabled={false}
      transparent={false}
      selectedGraphEndpoint={selectedGraphEndpoint}
      setSelectedGraphEndpoint={setSelectedGraphEndpoint}
    />
  )

  const graphPinchZoom = isMobile ? (
    <QuickPinchZoomOuter>
      <QuickPinchZoom onUpdate={onUpdate}>
        <QuickPinchZoomInner ref={graphRef}>{graphCmp}</QuickPinchZoomInner>
      </QuickPinchZoom>
    </QuickPinchZoomOuter>
  ) : (
    graphCmp
  )

  return (
    <ParaTimeSelectorGlow disabled={disabled}>
      <ParaTimeSelectorGlobe>
        {graphPinchZoom}
        <ZoomOutBtnFade in={ParaTimeSelectorUtils.showZoomOutBtn(selectedGraphEndpoint)}>
          <ZoomOutBtn
            variant="text"
            color="secondary"
            startIcon={<ChevronLeftIcon />}
            onClick={onZoomOutClick}
            disabled={disabled}
          >
            {t('home.zoomOutBtnText')}
          </ZoomOutBtn>
        </ZoomOutBtnFade>
        {ParaTimeSelectorUtils.showExploreBtn(step) && (
          <ExploreBtn
            color="secondary"
            variant="contained"
            onClick={onExploreClick}
            aria-label={exploreBtnTextTranslated}
          >
            {t('home.exploreBtnText')}
          </ExploreBtn>
        )}
      </ParaTimeSelectorGlobe>
    </ParaTimeSelectorGlow>
  )
}

export const ParaTimeSelector = memo(ParaTimeSelectorCmp)
