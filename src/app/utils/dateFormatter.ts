import {
  secondsInDay,
  secondsInHour,
  secondsInMinute,
  secondsInMonth,
  secondsInWeek,
  secondsInYear,
} from 'date-fns/constants'
import { differenceInSeconds } from 'date-fns/differenceInSeconds'
import { intlFormatDistance } from 'date-fns/intlFormatDistance'

const dateFormat = new Intl.DateTimeFormat()

export const intlDateFormat = (date: Date | number) => dateFormat.format(date)

// TODO: Works only in en-US locale, as suffixes are hardcoded
export const formatDistanceToNow = (
  date: Date | number,
  baseDate: Date | number = new Date(),
  locale = 'en-US',
) => {
  const diffInSeconds = differenceInSeconds(date, baseDate)
  let unit: Intl.RelativeTimeFormatUnit
  // Simplified from date-fns code, but without quarters
  if (Math.abs(diffInSeconds) < secondsInMinute) {
    unit = 'second'
  } else if (Math.abs(diffInSeconds) < secondsInHour) {
    unit = 'minute'
  } else if (Math.abs(diffInSeconds) < secondsInDay) {
    unit = 'hour'
  } else if (Math.abs(diffInSeconds) < secondsInWeek) {
    unit = 'day'
  } else if (Math.abs(diffInSeconds) < secondsInMonth) {
    unit = 'week'
  } else if (Math.abs(diffInSeconds) < secondsInYear) {
    unit = 'month'
  } else {
    unit = 'year'
  }

  return intlFormatDistance(date, baseDate, {
    unit,
    style: 'short',
    numeric: 'always',
    locale,
  })
    .replace(/ ago$/, '')
    .replace(/^in /, '')
    .replace(/\.$/, '')
}
