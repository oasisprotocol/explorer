import MatModal from '@mui/material/Modal'
import { ModalTypeMap } from '@mui/material/Modal/Modal'
import { FC } from 'react'
import { COLORS } from '../../../styles/theme/colors'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  maxWidth: '700px',
  maxHeight: '100vh',
  overflowY: 'auto',
  top: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  padding: `${theme.spacing(4)} ${theme.spacing(4)}`,
  boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
  backgroundColor: COLORS.white,
  borderRadius: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(5)} ${theme.spacing(6)}`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
}))

export const Modal: FC<ModalTypeMap['props']> = ({ children, ...restProps }) => {
  return (
    <MatModal {...restProps}>
      <ModalContent>{children}</ModalContent>
    </MatModal>
  )
}
