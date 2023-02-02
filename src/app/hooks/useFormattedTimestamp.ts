import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { useTranslation } from 'react-i18next'

export const useFormattedTimestamp = (timestamp: Date | undefined) => {
  const { t } = useTranslation()
  if (!timestamp) return ''
  return t('common.formattedBlockTimestamp', {
    timestamp,
    distance: formatDistanceStrict(timestamp, new Date(), {
      addSuffix: true,
    }),
    formatParams: {
      timestamp: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      },
    },
  })
}

export const useFormattedTimestampString = (timestamp: string | undefined) =>
  useFormattedTimestamp(timestamp ? new Date(timestamp) : undefined)
