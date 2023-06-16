import formatDistanceStrictDateFns from 'date-fns/formatDistanceStrict'
import locale from 'date-fns/locale/en-US'

const dateFormat = new Intl.DateTimeFormat()

export const intlDateFormat = (date: Date | number) => dateFormat.format(date)

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}} secs',
  xSeconds: '{{count}} secs',
  halfAMinute: '{{count}} secs',
  lessThanXMinutes: '{{count}} mins',
  xMinutes: '{{count}} mins',
  aboutXHours: '{{count}} hrs',
  xHours: '{{count}} hrs',
  xDays: '{{count}} days',
  aboutXWeeks: '{{count}} wks',
  xWeeks: '{{count}} wks',
  aboutXMonths: '{{count}} mos',
  xMonths: '{{count}} mos',
  aboutXYears: '{{count}} yrs',
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
