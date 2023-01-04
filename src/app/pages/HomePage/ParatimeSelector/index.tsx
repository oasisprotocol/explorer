import React, { memo } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import paratimeSelectorGlow from './images/paratime-selector-glow.svg'
import paratimeSelectorGlobe from './images/paratime-selector-globe.svg'
import { Graph } from './Graph'

const ParatimeSelectorGlow = styled(Box)(() => ({
  position: 'relative',
  width: '80vh',
  height: '80vh',
  marginTop: '-17vh',
  backgroundImage: `url("${paratimeSelectorGlow}")`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}))

const ParatimeSelectorGlobe = styled(Box)(() => ({
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

const ParatimeSelectorCmp = () => {
  return (
    <ParatimeSelectorGlow>
      <ParatimeSelectorGlobe>
        <Graph />
      </ParatimeSelectorGlobe>
    </ParatimeSelectorGlow>
  )
}

export const ParatimeSelector = memo(ParatimeSelectorCmp)
