import { useTranslation } from 'react-i18next'
import { renderHook } from '@testing-library/react'

/** Narrow No-Brake Space */
const NNBSP = '\u202F'

test('formatting dates with i18n', () => {
  const { result } = renderHook(() => {
    const { t } = useTranslation()
    return t('does_not_exist.use_default', '{{timestamp, dateTime}}', {
      timestamp: new Date('2022-04-23T12:20:56Z'),
      formatParams: {
        timestamp: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
          timeZone: 'UTC',
          locale: 'en-US',
        } satisfies Intl.DateTimeFormatOptions & { locale?: Intl.BCP47LanguageTag },
      },
    })
  })

  expect(result.current).toBe(`April 23, 2022 at 12:20${NNBSP}PM UTC`)
})

test('formatting fiat currency with i18n', () => {
  const { result } = renderHook(() => {
    const { t } = useTranslation()
    return t('does_not_exist.use_default', '{{value, currency}}', {
      value: 123.456789,
      formatParams: {
        value: {
          currency: 'USD',
          locale: 'en-US',
        } satisfies Intl.NumberFormatOptions & { locale?: Intl.BCP47LanguageTag },
      },
    })
  })

  expect(result.current).toBe('$123.46')
})

test('formatting block sizes with i18n', () => {
  const { result } = renderHook(() => {
    const { t } = useTranslation()
    return t('does_not_exist.use_default', '{{size, number}}', {
      size: 12345,
      formatParams: {
        size: {
          style: 'unit',
          unit: 'byte',
          unitDisplay: 'long',
          locale: 'en-US',
        } satisfies Intl.NumberFormatOptions & { locale?: Intl.BCP47LanguageTag },
      },
    })
  })

  expect(result.current).toBe('12,345 bytes')
})
