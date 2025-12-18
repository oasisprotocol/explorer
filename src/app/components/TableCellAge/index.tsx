import { FC } from 'react'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { formatDistanceToNow } from '../../utils/dateFormatter'
import { useFormattedTimestamp } from '../../hooks/useFormattedTimestamp'
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
  const distanceWithSuffix = formatDistanceToNow(date, { keepSuffix: true, style: 'long' })
  const title = (
    <>
      <div className="font-medium">{defaultFormatted}</div>
      <div className="font-normal">{distanceWithSuffix}</div>
    </>
  )
  const content = ageHeaderType === TableAgeType.DateTime ? tableFormatted : distance

  return (
    <Tooltip title={title}>
      <div>{content}</div>
    </Tooltip>
  )
}
