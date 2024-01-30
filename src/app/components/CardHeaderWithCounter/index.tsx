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
    <Box sx={{ display: 'flex', alignItems: 'baseline' }} gap={2}>
      <Typography
        fontWeight={700}
        component="span"
        color={isMobile && changeMobileColors ? COLORS.white : COLORS.brandExtraDark}
        fontSize={24}
      >
        {label}
      </Typography>
      {!!totalCount && (
        <Typography
          fontWeight={700}
          component="span"
          color={isMobile && changeMobileColors ? COLORS.white : COLORS.grayMedium}
        >
          ({`${isTotalCountClipped ? ' > ' : ''}${totalCount}`})
        </Typography>
      )}
    </Box>
  )
}
