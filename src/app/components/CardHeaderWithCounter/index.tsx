import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'

type CardHeaderWithCounterProps = {
  label: string | undefined
  totalCount: number | undefined
  isTotalCountClipped: boolean | undefined
}

export const CardHeaderWithCounter: FC<CardHeaderWithCounterProps> = ({
  label,
  totalCount,
  isTotalCountClipped,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={2}>
      <Typography color={COLORS.brandExtraDark} fontSize={24}>
        {label}
      </Typography>
      {!!totalCount && (
        <Typography color={COLORS.grayMedium}>
          ({`${isTotalCountClipped ? ' > ' : ''}${totalCount}`})
        </Typography>
      )}
    </Box>
  )
}
