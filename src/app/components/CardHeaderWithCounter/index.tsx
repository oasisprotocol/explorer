import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'
import { useScreenSize } from '../../hooks/useScreensize'

type CardHeaderWithCounterProps = {
  label: string | undefined
  totalCount: number | undefined
  isTotalCountClipped: boolean | undefined
  changeMobileColors?: boolean
}

export const CardHeaderWithCounter: FC<CardHeaderWithCounterProps> = ({
  label,
  totalCount,
  isTotalCountClipped,
  changeMobileColors,
}) => {
  const { isMobile } = useScreenSize()

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={'0.8ex'}>
      <Typography
        fontWeight={700}
        component="span"
        color={isMobile && changeMobileColors ? COLORS.white : COLORS.brandExtraDark}
        fontSize="inherit"
      >
        {label}
      </Typography>
      {!!totalCount && (
        <Typography
          fontWeight="normal"
          component="span"
          color={isMobile && changeMobileColors ? COLORS.white : COLORS.grayMedium}
          fontSize="inherit"
        >
          ({`${isTotalCountClipped ? '>' : ''}${totalCount}`})
        </Typography>
      )}
    </Box>
  )
}
