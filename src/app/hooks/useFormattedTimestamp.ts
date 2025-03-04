import { formatDistanceStrict } from 'date-fns/formatDistanceStrict'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from './useScreensize'

export const useFormattedTimestamp = (
  timestamp: Date | undefined,
  dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  },
) => {
  const { t } = useTranslation()
  if (!timestamp) return ''
  return t('common.formattedDateTime', {
    timestamp,
    formatParams: {
      timestamp: {
        ...dateTimeFormatOptions,
      },
    },
  })
}

export const useFormattedTimestampWithDistance = (
  timestamp: Date | undefined,
  dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  },
) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  if (!timestamp) return ''
  const distance = formatDistanceStrict(timestamp, new Date(), {
    addSuffix: true,
  })
  return isMobile
    ? distance
    : t('common.formattedBlockTimestamp', {
        timestamp,
        distance,
        formatParams: {
          timestamp: {
            ...dateTimeFormatOptions,
          },
        },
      })
}

export const useFormattedTimestampStringWithDistance = (
  timestamp: string | undefined,
  dateTimeFormatOptions?: Intl.DateTimeFormatOptions,
) => useFormattedTimestampWithDistance(timestamp ? new Date(timestamp) : undefined, dateTimeFormatOptions)

export const getTimeZone = () => {
  const date = new Date()
  const formatter = new Intl.DateTimeFormat(undefined, {
    timeZoneName: 'short',
  })

  const parts = formatter.formatToParts(date)
  const timeZonePart = parts.find(part => part.type === 'timeZoneName')

  return timeZonePart?.value
}
