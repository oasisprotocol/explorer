import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledSquare = styled(Box, {
  shouldForwardProp: prop => prop !== 'success',
})(({ success }: { success?: boolean }) => {
  return {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '3px',
    backgroundColor: success ? COLORS.eucalyptus : COLORS.errorIndicatorBackground,
  }
})

type BlockStatsProps<T> = {
  data: T[]
  dataKey: Extract<keyof T, string>
  legendLabels?: {
    success: string
    fail: string
  }
  tooltipFormatter?: (data: string) => ReactNode
}

export const BlockStats = <T extends { [key: string]: any }>({
  data,
  dataKey,
  legendLabels,
  tooltipFormatter,
}: BlockStatsProps<T>) => {
  const statusKey = Object.keys(data[0]).find(key => key !== dataKey)
  if (!statusKey) {
    throw new Error('Not able to determine status key')
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={2}>
        {data.map(item => {
          const title = tooltipFormatter ? tooltipFormatter(item[dataKey].toString()) : item[dataKey]
          return (
            <Tooltip key={item[dataKey]} title={title} placement="top">
              <StyledSquare success={item[statusKey]} />
            </Tooltip>
          )
        })}
      </Box>
      {legendLabels && (
        <Box pt={5} sx={{ display: 'flex' }}>
          <Box gap={3} mr={4} sx={{ display: 'flex' }}>
            <StyledSquare success /> {legendLabels.success}
          </Box>
          <Box gap={3} sx={{ display: 'flex' }}>
            <StyledSquare /> {legendLabels.fail}
          </Box>
        </Box>
      )}
    </>
  )
}
