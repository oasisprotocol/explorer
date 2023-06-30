import { FC } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'

export const ScrollableDataDisplay: FC<{ data: string; fontWeight?: number }> = ({
  data,
  fontWeight = 700,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        padding: '10px 0px 0px 0px',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          borderRadius: '5px',
          background: COLORS.grayLight,
          border: `1px solid ${COLORS.grayMedium}`,
          height: '349px',
          overflowY: 'scroll',
          p: 3,
        }}
      >
        <Typography
          variant="mono"
          fontSize={16}
          sx={{
            fontWeight,
            overflowWrap: 'anywhere',
          }}
          color={COLORS.brandExtraDark}
        >
          {data}
        </Typography>
      </Box>
    </Box>
  )
}
