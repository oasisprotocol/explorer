import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import backgroundEmptyState from './images/background-empty-state.svg'
import CancelIcon from '@mui/icons-material/Cancel'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  color: theme.palette.layout.main,
  backgroundColor: theme.palette.background.empty,
  backgroundImage: `url("${backgroundEmptyState}")`,
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

export const EmptyState: FC<EmptyStateProps> = ({ description, title, light, minHeight = '250px' }) => {
  const content = (
    <>
      <Typography component="span" sx={{ fontSize: '24px', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography component="span" sx={{ fontSize: '16px' }}>
        {description}
      </Typography>
    </>
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
