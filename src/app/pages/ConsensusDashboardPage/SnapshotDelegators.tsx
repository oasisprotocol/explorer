import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useScreenSize } from '../../hooks/useScreensize'

export const SnapshotDelegators: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  // TODO: provide delegators number when API is ready
  const delegators = undefined

  return (
    <SnapshotTextCard title={t('validator.delegators')}>
      <Box sx={{ pb: isMobile ? 3 : 5 }}>{delegators}</Box>
    </SnapshotTextCard>
  )
}
