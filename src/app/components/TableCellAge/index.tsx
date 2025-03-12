import { FC } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { formatDistanceToNow } from '../../utils/dateFormatter'
import Box from '@mui/material/Box'
import { useFormattedTimestamp } from '../../hooks/useFormattedTimestamp'
import { tooltipDelay } from '../../../styles/theme'
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { TableAgeType } from '../../../types/table-age-type'

export const TableCellAge: FC<{ sinceTimestamp: string }> = ({ sinceTimestamp }) => {
  const {
    settings: { ageHeaderType },
  } = useLocalSettings()

  const date = new Date(sinceTimestamp)
  const defaultFormatted = useFormattedTimestamp(date)
  const tableFormatted = useFormattedTimestamp(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  if (isNaN(date.getTime())) return null

  const distance = formatDistanceToNow(date)
  const distanceWithSuffix = formatDistanceStrict(sinceTimestamp, new Date(), {
    addSuffix: true,
  })
  const title = (
    <span>
      {defaultFormatted}
      <Box fontWeight={100}>{distanceWithSuffix}</Box>
    </span>
  )
  const content = ageHeaderType === TableAgeType.DateTime ? tableFormatted : distance

  return (
    <Tooltip title={title} enterDelay={tooltipDelay} placement={'top'}>
      <Box>{content}</Box>
    </Tooltip>
  )
}
