import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export const useFormattedTimestamp = (timestamp: Date | undefined) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          } satisfies Intl.DateTimeFormatOptions,
        },
      })
}

export const useFormattedTimestampString = (timestamp: string | undefined) =>
  useFormattedTimestamp(timestamp ? new Date(timestamp) : undefined)
