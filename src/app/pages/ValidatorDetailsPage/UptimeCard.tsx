import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { UptimeStatus } from '../../components/UptimeStatus'

export const UptimeCard: FC = () => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard
      title={t('validator.uptime')}
      label={
        <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>
          {t('validator.signedBlocksPercentage')}
        </Typography>
      }
    >
      {/* TODO: provide data when API is ready  */}
      <UptimeStatus percentage={94} status={[100, 100, 100, 50]} />
    </SnapshotTextCard>
  )
}
