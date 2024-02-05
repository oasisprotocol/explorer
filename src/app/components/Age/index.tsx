import { FC } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { formatDistanceToNow } from '../../utils/dateFormatter'
import Box from '@mui/material/Box'
import { useFormattedTimestamp } from '../../hooks/useFormattedTimestamp'
import { tooltipDelay } from '../../../styles/theme'
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict'

export const Age: FC<{ sinceTimestamp: string }> = ({ sinceTimestamp }) => {
  const date = new Date(sinceTimestamp)
  const actualTime = useFormattedTimestamp(date)
  const distance = formatDistanceToNow(date)
  const distanceWithSuffix = formatDistanceStrict(sinceTimestamp, new Date(), {
    addSuffix: true,
  })
  const title = (
    <span>
      {actualTime}
      <Box fontWeight={100}>{distanceWithSuffix}</Box>
    </span>
  )
  return (
    <Tooltip title={title} enterDelay={tooltipDelay} placement={'top'}>
      <Box>{distance}</Box>
    </Tooltip>
  )
}
