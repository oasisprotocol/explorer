import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from './SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { testnet } from '../../utils/externalLinks'

const StyledBox = styled(Box)(({ theme }) => ({
  gap: theme.spacing(5),
  padding: `0 ${theme.spacing(4)} ${theme.spacing(4)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
}))

export const TestnetFaucet: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotCard title={t('testnetFaucet.header')} withContentPadding={false}>
      <StyledBox>
        <Typography
          sx={{
            fontSize: '12px',
            color: COLORS.grayMedium,
          }}
        >
          {t('testnetFaucet.description')}
        </Typography>
        <Button
          href={testnet.faucet}
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
          variant="outlined"
          sx={{ textTransform: 'capitalize', textAlign: 'center' }}
        >
          {t('testnetFaucet.request')}
        </Button>
      </StyledBox>
    </SnapshotCard>
  )
}
