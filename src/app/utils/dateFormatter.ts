import formatDistanceStrictDateFns from 'date-fns/formatDistanceStrict'
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

export const formatDistance = (token: keyof typeof formatDistanceLocale, count: string) =>
  formatDistanceLocale[token].replace('{{count}}', count)

export const formatDistanceStrict = (date: Date, baseDate: Date) =>
  formatDistanceStrictDateFns(date, baseDate, {
    locale: {
      ...locale,
      formatDistance,
    },
  })
