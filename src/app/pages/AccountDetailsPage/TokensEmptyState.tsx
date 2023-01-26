import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import { COLORS } from '../../../styles/theme/colors'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  gap: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(5)} ${theme.spacing(2)} ${theme.spacing(6)}`,
  },
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(6)} ${theme.spacing(4)} ${theme.spacing(7)}`,
  },
}))

type TokensEmptyStateProps = {
  label: string
}

export const TokensEmptyState: FC<TokensEmptyStateProps> = ({ label }) => {
  const { t } = useTranslation()

  return (
    <StyledBox>
      <ReportGmailerrorredIcon sx={{ color: COLORS.brandDark, fontSize: '55px' }} />
      <Typography sx={{ color: COLORS.grayDark }}>{t('account.emptyTokenList', { token: label })}</Typography>
    </StyledBox>
  )
}
