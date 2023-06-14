import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import { cardClasses } from '@mui/material/Card'
import { boxClasses } from '../../utils/mui-helpers'
import useMediaQuery from '@mui/material/useMediaQuery'
import { paperClasses } from '@mui/material/Paper'

export const ResultListFrame = styled(Box)(({ theme: wantedTheme }) => {
  const currentTheme = useTheme()
  const isMobile = useMediaQuery(wantedTheme.breakpoints.down('sm'))
  return isMobile
    ? {
        [`&& > div > .${paperClasses.root}`]:
          currentTheme.palette.layout.border !== wantedTheme.palette.layout.networkBubbleBorder &&
          wantedTheme.palette.layout.networkBubbleBackground !==
            wantedTheme.palette.layout.networkBubbleBorder
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
        background: wantedTheme.palette.layout.networkBubbleBackground,
        borderRadius: 12,
        boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
        [`&& .${cardClasses.root}`]: {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingLeft: 64,
          paddingRight: 64,
          background: wantedTheme.palette.layout.networkBubbleBackground,
        },
        [`&& .${cardClasses.root} > .${boxClasses.root}`]: {
          background: wantedTheme.palette.layout.networkBubbleBorder,
          borderRadius: 0,
          marginLeft: -64,
          marginTop: -32,
          marginRight: -64,
          paddingLeft: 64,
          paddingRight: 64,
          paddingBottom: 32,
          paddingTop: 32,
        },
      }
})
