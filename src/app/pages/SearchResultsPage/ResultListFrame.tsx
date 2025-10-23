import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { COLORS } from '../../../styles/theme/colors'

export const ResultListFrame = styled('div')(({ theme: wantedTheme }) => {
  const currentTheme = useTheme()
  const isMobile = useMediaQuery(wantedTheme.breakpoints.down('sm'))
  return isMobile
    ? {
        [`&& > div > [data-slot="card"]`]:
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
        borderRadius: 6,
      }
})
