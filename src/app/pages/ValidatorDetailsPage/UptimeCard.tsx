import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { ValidatorUptime } from '../../../oasis-nexus/api'
import { UptimeStatus } from '../../components/UptimeStatus'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type UptimeCardProps = {
  uptime?: ValidatorUptime
}

export const UptimeCard: FC<UptimeCardProps> = ({ uptime }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('validator.uptime')} withContentPadding={false}>
      {uptime && (
        <div className="flex flex-col mb-8">
          <Typography variant="xsmall" textColor="muted" className="font-normal text-left pb-2">
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
