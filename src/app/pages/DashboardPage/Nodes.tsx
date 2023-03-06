import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { SnapshotCard } from './SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'

export const Nodes: FC = () => {
  const { t } = useTranslation()
  /* TODO: Replace with real values when endpoint is ready */
  const activeNodes = 70

  return (
    <SnapshotCard title={t('nodes.title')}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
        <Typography component="span" sx={{ fontSize: '48px', fontWeight: 700, color: COLORS.brandDark }}>
          {t('nodes.value', { value: activeNodes })}
        </Typography>
      </Box>
    </SnapshotCard>
  )
}
