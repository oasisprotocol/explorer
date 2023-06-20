import intlFormatDistance from 'date-fns/intlFormatDistance'

const dateFormat = new Intl.DateTimeFormat()

export const intlDateFormat = (date: Date | number) => dateFormat.format(date)

// TODO: Works only in en-US locale, as suffixes are hardcoded
export const formatDistanceToNow = (
  date: Date | number,
  baseDate: Date | number = new Date(),
  locale = 'en-US',
) => {
  return intlFormatDistance(date, baseDate, {
    style: 'short',
    numeric: 'always',
    locale,
  })
    .replace(/ ago/, '')
    .replace(/in /, '')
    .replace(/\./, '')
}
