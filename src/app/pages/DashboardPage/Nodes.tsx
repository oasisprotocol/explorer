import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import BoltIcon from '@mui/icons-material/Bolt'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { Circle } from '../../components/Circle'
import { SnapshotCard } from './SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'

export const Nodes: FC = () => {
  const { t } = useTranslation()
  /* TODO: Replace with real values when endpoint is ready */
  const activeNodes = 70
  const inactiveNodes = 1

  return (
    <SnapshotCard
      title={t('nodes.title')}
      badge={
        <Chip
          color="primary"
          icon={
            <Circle color={COLORS.grayMediumLight} size={4} sx={{ border: `2px solid ${COLORS.grayMedium}` }}>
              <BoltIcon sx={{ fontSize: '12px', color: COLORS.grayMedium }} />
            </Circle>
          }
          label={t('nodes.inactive', { count: inactiveNodes })}
          variant="outlined"
        />
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <OfflineBoltIcon fontSize="large" sx={{ color: COLORS.eucalyptus, mr: 3 }} />
        <Typography component="span" sx={{ fontSize: '48px', fontWeight: 700, color: COLORS.brandDark }}>
          {t('nodes.value', { value: activeNodes })}
        </Typography>
      </Box>
    </SnapshotCard>
  )
}
