import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 3,
  flex: 1,
  borderRadius: 10,
  padding: theme.spacing(2, 2, 2, '10px'),
  fontSize: '12px',
  minWidth: '85px',
}))

const StyledIcon = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px',
})

type BadgeProps = {
  backgroundColor: string
  icon: ReactNode
  label: string
  textColor: string
}

export const Badge: FC<BadgeProps> = ({ backgroundColor, icon, label, textColor }) => {
  return (
    <StyledBox sx={{ backgroundColor, color: textColor }}>
      {label}
      <StyledIcon>{icon}</StyledIcon>
    </StyledBox>
  )
}
