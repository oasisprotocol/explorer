import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { cardClasses } from '@mui/material/Card'
import { boxClasses } from '../../utils/mui-helpers'

export const ResultListFrame = styled(Box)(({ theme }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return {
    marginBottom: 20,
    border: isMobile ? 'none' : `solid 15px ${theme.palette.layout.networkBubbleBorder}`,
    background: theme.palette.layout.networkBubbleBackground,
    borderRadius: 12,
    boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
    [`&& .${cardClasses.root}`]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      paddingLeft: 64,
      paddingRight: 64,
      background: theme.palette.layout.networkBubbleBackground,
    },
    [`&& .${cardClasses.root} > .${boxClasses.root}`]: {
      background: theme.palette.layout.networkBubbleBorder,
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
