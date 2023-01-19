import { useTranslation } from 'react-i18next'
import { renderHook } from '@testing-library/react'

test('formatting dates with i18n', () => {
  const { result } = renderHook(() => {
    const { t } = useTranslation()
    return t('does_not_exist.use_default', '{{timestamp, dateTime}}', {
      timestamp: new Date('2022-01-02T03:04:05.006Z'),
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
        },
      },
    })
  })

  expect(result.current).toBe('January 2, 2022, 3:04 AM UTC')
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
        },
      },
    })
  })

  expect(result.current).toBe('$123.46')
})
