import React, { memo } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import paratimeSelectorGlow from './images/paratime-selector-glow.svg'
import paratimeSelectorGlobe from './images/paratime-selector-globe.svg'
import { Graph } from './Graph'

const ParatimeSelectorGlow = styled(Box)(() => ({
  position: 'relative',
  width: '645px',
  height: '645px',
  backgroundImage: `url("${paratimeSelectorGlow}")`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))

const ParatimeSelectorGlobe = styled(Box)(() => ({
  position: 'absolute',
  width: '60%',
  paddingBottom: '60%',
  left: '50%',
  bottom: '8%',
  transform: 'translateX(-50%)',
  backgroundImage: `url("${paratimeSelectorGlobe}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))

const ParatimeSelectorGraphContainer = styled(Box)(() => ({
  position: 'absolute',
  width: '85%',
  height: '70%',
  left: '50%',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
}))

const ParatimeSelectorCmp = () => {
  return (
    <ParatimeSelectorGlow>
      <ParatimeSelectorGlobe>
        <ParatimeSelectorGraphContainer>
          <Graph disabled={false} />
        </ParatimeSelectorGraphContainer>
      </ParatimeSelectorGlobe>
    </ParatimeSelectorGlow>
  )
}

export const ParatimeSelector = memo(ParatimeSelectorCmp)
