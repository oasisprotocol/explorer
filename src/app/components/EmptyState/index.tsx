import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import lightBackgroundEmptyState from './images/background-empty-state.svg'
import darkBackgroundEmptyState from './images/background-empty-state-dark.svg'
import CancelIcon from '@mui/icons-material/Cancel'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: theme.palette.layout.main,
  backgroundImage: `url("${darkBackgroundEmptyState}")`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  borderRadius: 6,
}))

const StyledBoxLight = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  backgroundImage: `url("${lightBackgroundEmptyState}")`,
  color: COLORS.brandExtraDark,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '100%',
}))

type EmptyStateProps = {
  description: ReactNode
  title: string
  light?: boolean
  minHeight?: number | string
}

export const EmptyState: FC<EmptyStateProps> = ({ description, title, light, minHeight = '360px' }) => {
  const theme = useTheme()
  const content = (
    <Box sx={{ color: light ? 'inherit' : theme.palette.layout.contrastMain, textAlign: 'center' }}>
      <Typography component="span" sx={{ fontSize: '30px', fontWeight: 500, display: 'block' }}>
        {title}
      </Typography>
      <Typography component="span" sx={{ fontSize: '16px' }}>
        {description}
      </Typography>
    </Box>
  )
  return light ? (
    <StyledBoxLight sx={{ minHeight }}>
      <CancelIcon color="error" fontSize="large" />
      {content}
    </StyledBoxLight>
  ) : (
    <StyledBox sx={{ minHeight }}>{content}</StyledBox>
  )
}
