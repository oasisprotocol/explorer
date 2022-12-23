import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import blockchainImage from './images/blockchain.svg'
import { emeraldRoute } from '../../../routes'
import { COLORS } from '../../../styles/theme/colors'

const StyledCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing(6),
  minWidth: theme.spacing(6),
  height: theme.spacing(6),
  backgroundColor: COLORS.white,
  borderRadius: theme.spacing(5),
  marginRight: theme.spacing(4),
}))

const getLabel = (t: TFunction, pathname: string) => {
  if (pathname.startsWith(emeraldRoute)) {
    return t('common.emerald')
  }
}

export const NetworkHeader: FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const label = getLabel(t, pathname)

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledCircle>
        <img src={blockchainImage} alt={label} />
      </StyledCircle>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h2" color={COLORS.white} sx={{ pr: 4 }}>
            {label}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 10, color: COLORS.ceil, mr: 3 }} component="span">
              {t('pageHeader.status')}
            </Typography>
            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: 11, color: COLORS.white }}>{t('pageHeader.emerald')}</Typography>
      </Box>
    </Box>
  )
}
