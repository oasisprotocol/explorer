import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import { cardClasses } from '@mui/material/Card'
import { boxClasses } from '../../utils/mui-helpers'
import useMediaQuery from '@mui/material/useMediaQuery'
import { paperClasses } from '@mui/material/Paper'
import { COLORS } from '../../../styles/theme/colors'

export const ResultListFrame = styled(Box)(({ theme: wantedTheme }) => {
  const currentTheme = useTheme()
  const isMobile = useMediaQuery(wantedTheme.breakpoints.down('sm'))
  return isMobile
    ? {
        [`&& > div > .${paperClasses.root}`]:
          currentTheme.palette.layout.border !== wantedTheme.palette.layout.networkBubbleBorder &&
          wantedTheme.palette.layout.main !== wantedTheme.palette.layout.networkBubbleBorder
            ? {
                borderRadius: 0,
                border: `solid ${wantedTheme.palette.layout.networkBubbleBorder}`,
                borderWidth: '10px 1px',
              }
            : {},
      }
    : {
        marginBottom: 20,
        border: `solid 15px ${wantedTheme.palette.layout.networkBubbleBorder}`,
        background: COLORS.white,
        borderRadius: 12,
        boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
        // Negative margins won't work with default Card overflow
        [`&& .${cardClasses.root}`]: { overflow: 'initial' },
        [`&& .${cardClasses.root} > .${boxClasses.root}`]: {
          background: wantedTheme.palette.layout.networkBubbleBorder,
          marginLeft: -78,
          marginTop: -48,
          marginRight: -78,
          paddingLeft: 64,
          paddingRight: 64,
        },
      }
})
