import formatDistanceStrictDateFns from 'date-fns/formatDistanceStrict'
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

export const formatDistance = (token: keyof typeof formatDistanceLocale, count: string) =>
  formatDistanceLocale[token].replace('{{count}}', count)

export const formatDistanceStrict = (date: Date, baseDate: Date) =>
  formatDistanceStrictDateFns(date, baseDate, {
    locale: {
      ...locale,
      formatDistance,
    },
  })
