import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'
import { useTheme } from '@mui/material/styles'

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
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={'0.8ex'}>
      <Typography
        fontWeight={700}
        component="span"
        color={theme.palette.layout.titleOnBackground}
        fontSize="inherit"
      >
        {label}
      </Typography>
      {!!totalCount && (
        <Typography fontWeight="normal" component="span" color={COLORS.grayMedium} fontSize="inherit">
          ({`${isTotalCountClipped ? '>' : ''}${totalCount}`})
        </Typography>
      )}
    </Box>
  )
}
