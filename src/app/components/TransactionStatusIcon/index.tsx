import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'success' && prop !== 'withText',
})(({ success, withText }: TransactionStatusIconProps) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: withText ? undefined : '28px',
  height: '28px',
  fontSize: '15px',
  backgroundColor: success ? COLORS.honeydew : COLORS.linen,
  color: success ? COLORS.eucalyptus : COLORS.errorIndicatorBackground,
  borderRadius: 10,
  padding: 4,
  paddingLeft: 12,
  paddingRight: 12,
}))

type TransactionStatusIconProps = {
  success: boolean
  withText?: boolean
}

export const TransactionStatusIcon: FC<TransactionStatusIconProps> = ({ success, withText }) => {
  const { t } = useTranslation()
  return (
    <StyledBox success={success} withText={withText}>
      {withText && (
        <span>
          {success ? t('common.success') : t('common.failed')}
          &nbsp;
        </span>
      )}
      {success ? (
        <CheckCircleIcon color="success" fontSize="inherit" />
      ) : (
        <CancelIcon color="error" fontSize="inherit" />
      )}
    </StyledBox>
  )
}
