import { useTranslation } from 'react-i18next'
import { renderHook } from '@testing-library/react'
import { getPreciseNumberFormat } from '../getPreciseNumberFormat'

const usePreciseNumberFormat = (props: { value: string }) => {
  const { t } = useTranslation()
  return t('common.valueLong', getPreciseNumberFormat(props.value))
}

describe('getPreciseNumberFormat', () => {
  test('should render precise number with formatting', () => {
    const { result } = renderHook(usePreciseNumberFormat, {
      initialProps: { value: '111222333444555666777888999.111222333444555666' },
    })
    expect(result.current).toBe('111,222,333,444,555,666,777,888,999.111222333444555666')
  })

  test('should still render precise number beyond Intl limit but without formatting', () => {
    const { result } = renderHook(usePreciseNumberFormat, {
      initialProps: {
        value: '111222333444555666777888999.111222333444555666777888999000111222333444555666777888999',
      },
    })
    expect(result.current).toBe(
      '111222333444555666777888999.111222333444555666777888999000111222333444555666777888999',
    )
  })

  test('should throw if undefined', () => {
    expect(() => getPreciseNumberFormat(undefined as any)).toThrow()
  })

  test('should throw if string is empty', () => {
    expect(() => getPreciseNumberFormat('')).toThrow()
  })

  test('should throw if not a number', () => {
    expect(() => getPreciseNumberFormat('a')).toThrow()
  })
})
