import { FC } from 'react'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'success',
})(({ success }: { success: boolean }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '28px',
  height: '28px',
  fontSize: '15px',
  backgroundColor: success ? COLORS.honeydew : COLORS.linen,
  borderRadius: 10,
}))

type TransactionStatusIconProps = {
  success: boolean
}

export const TransactionStatusIcon: FC<TransactionStatusIconProps> = ({ success }) => {
  return (
    <StyledBox success={success}>
      {success ? (
        <CheckCircleIcon color="success" fontSize="inherit" />
      ) : (
        <CancelIcon color="error" fontSize="inherit" />
      )}
    </StyledBox>
  )
}
