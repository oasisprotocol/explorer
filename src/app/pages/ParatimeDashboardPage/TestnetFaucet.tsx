import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { faucet } from '../../utils/externalLinks'
import { Layer } from '../../../oasis-nexus/api'

const StyledBox = styled(Box)(({ theme }) => ({
  gap: theme.spacing(5),
  padding: `0 ${theme.spacing(4)} ${theme.spacing(4)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
}))

type TestnetFaucetProps = {
  layer: Layer
}

export const TestnetFaucet: FC<TestnetFaucetProps> = ({ layer }) => {
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
          href={faucet[layer]}
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
