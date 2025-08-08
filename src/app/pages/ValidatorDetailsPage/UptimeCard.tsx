import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { ValidatorUptime } from '../../../oasis-nexus/api'
import { UptimeStatus } from '../../components/UptimeStatus'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'

type UptimeCardProps = {
  uptime?: ValidatorUptime
}

export const UptimeCard: FC<UptimeCardProps> = ({ uptime }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.uptime')} withContentPadding={false}>
      {uptime && (
        <div className="flex flex-col mb-8">
          <Typography sx={{ fontSize: 12, color: COLORS.grayMedium, textAlign: 'left', paddingBottom: 3 }}>
            {t('validator.uptimeLast24')}
          </Typography>
          <div className="flex items-center justify-center mx-auto mt-2">
            <UptimeStatus uptime={uptime} />
          </div>
        </div>
      )}
    </SnapshotTextCard>
  )
}
