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

export const useFormattedTimestampStringWithDistance = (
  timestampStr: string | undefined,
  dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  },
) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  if (!timestampStr) return ''
  const timestamp = new Date(timestampStr)
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

export const getTimeZone = () => {
  const date = new Date()
  const formatter = new Intl.DateTimeFormat(undefined, {
    timeZoneName: 'short',
  })

  const parts = formatter.formatToParts(date)
  const timeZonePart = parts.find(part => part.type === 'timeZoneName')

  return timeZonePart?.value
}
