import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type SnapshotCardLabelProps = {
  label: string
  value: number | undefined
}
export const SnapshotCardDurationLabel: FC<SnapshotCardLabelProps> = ({ label, value }) => {
  if (!value) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3 }}>
      <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>{label}</Typography>
      <Typography sx={{ fontSize: 'inherit' }}>{value.toLocaleString()}</Typography>
    </Box>
  )
}
