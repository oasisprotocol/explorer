import BigNumber from 'bignumber.js'

export function getPreciseNumberFormat(value: string) {
  const decimalPlaces = new BigNumber(value).decimalPlaces()
  // Fallback if types are not strict enough to prevent value=undefined and ''
  if (value == null || value === '' || decimalPlaces == null) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Not a number in getNumberFormat(${value})`)
    }
    // Note: changing this to { value: '-' } would still display "NaN"
    return { value: 'NaN' }
  }

  return {
    value: value,
    formatParams: {
      value: {
        // TODO: Intl internals only work up to maximumFractionDigits: 20.
        // `new Intl.NumberFormat(undefined, { maximumFractionDigits: 21 }).format('1')`
        // throws an error, i18n silences it, and displays unformatted original string
        maximumFractionDigits: decimalPlaces <= 20 ? 20 : Infinity,
      } satisfies Intl.NumberFormatOptions,
    },
  }
}
