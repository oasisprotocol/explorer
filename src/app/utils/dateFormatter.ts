import { formatDistanceToNow as dateFnsFormatDistanceToNow } from 'date-fns'
import locale from 'date-fns/locale/en-US'

const dateFormat = new Intl.DateTimeFormat()

export const intlDateFormat = (date: Date | number) => dateFormat.format(date)

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: 's',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
}

const formatDistance = (
  token: keyof typeof formatDistanceLocale,
  count: string,
  options: {
    includeSeconds?: boolean
    addSuffix?: boolean
    comparison?: number
  } = {},
) => {
  const { addSuffix, comparison = 0 } = options

  const result = formatDistanceLocale[token].replace('{{count}}', count)

  if (addSuffix) {
    if (comparison > 0) {
      return `in ${result}`
    } else {
      return `${result} ago`
    }
  }

  return result
}

export const formatDistanceToNow = (date: Date, shortFormat = true) => {
  if (shortFormat) {
    return dateFnsFormatDistanceToNow(date, {
      addSuffix: true,
      locale: {
        ...locale,
        formatDistance,
      },
    })
  }

  return dateFnsFormatDistanceToNow(date, {
    addSuffix: true,
  })
}
