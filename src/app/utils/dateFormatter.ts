import { formatDistanceToNow as dateFnsFormatDistanceToNow } from 'date-fns'
import locale from 'date-fns/locale/en-US'

const dateFormat = new Intl.DateTimeFormat()

export const intlDateFormat = (date: Date | number) => dateFormat.format(date)

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}sec',
  xSeconds: '{{count}}sec',
  halfAMinute: 'secs',
  lessThanXMinutes: '{{count}}min',
  xMinutes: '{{count}}mins',
  aboutXHours: '{{count}}hr',
  xHours: '{{count}}hrs',
  xDays: '{{count}}days',
  aboutXWeeks: '{{count}}wk',
  xWeeks: '{{count}}wks',
  aboutXMonths: '{{count}}mos',
  xMonths: '{{count}}mos',
  aboutXYears: '{{count}}yr',
  xYears: '{{count}}yrs',
  overXYears: '{{count}}yrs',
  almostXYears: '{{count}}yrs',
}

interface FormatDistanceOpts {
  includeSeconds?: boolean
  addSuffix?: boolean
  comparison?: number
}

const formatDistance = (
  token: keyof typeof formatDistanceLocale,
  count: string,
  options: FormatDistanceOpts = {},
) => {
  const { addSuffix, comparison = 0 } = options

  const result = formatDistanceLocale[token].replace('{{count}}', `${count} `)

  if (addSuffix) {
    if (comparison > 0) {
      return `in ${result}`
    } else {
      return `${result} ago`
    }
  }

  return result
}

export const formatDistanceToNow = (date: Date, shortFormat = true, opts: FormatDistanceOpts = {}) => {
  if (shortFormat) {
    return dateFnsFormatDistanceToNow(date, {
      locale: {
        ...locale,
        formatDistance,
      },
      ...opts,
    })
  }

  return dateFnsFormatDistanceToNow(date, {
    ...opts,
  })
}
