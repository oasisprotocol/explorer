import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'
import { useScreenSize } from '../../hooks/useScreensize'

type SnapshotDelegatorsProps = {
  totalDelegators: number | undefined
}

export const SnapshotDelegators: FC<SnapshotDelegatorsProps> = ({ totalDelegators }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  return (
    <SnapshotTextCard title={t('validator.delegators')}>
      {totalDelegators && <Box sx={{ pb: isMobile ? 3 : 5 }}>{totalDelegators.toLocaleString()}</Box>}
    </SnapshotTextCard>
  )
}
