import BigNumber from 'bignumber.js'

const isPreciseIntlSupported =
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 })
    .format('111222333444555666777888999.111222333444555666')
    // Chrome 115 and Firefox 116 return '111,222,333,444,555,666,777,888,999.111222333444555666'
    // Firefox 115 and Safari 16.5 return '111,222,333,444,555,670,000,000,000'
    .at(-1) === '6'

export function getPreciseNumberFormat(value: string) {
  const decimalPlaces = new BigNumber(value).decimalPlaces()
  const isFloatPrecise = new BigNumber(value).isEqualTo(parseFloat(value))
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
        maximumFractionDigits:
          (isPreciseIntlSupported || isFloatPrecise) && decimalPlaces <= 20 ? 20 : Infinity,

        // Display "+" prefix for amount_change to indicate relative change.
        // Hopefully negative numbers have "-" prefix in all languages.
        signDisplay: value.startsWith('+') ? 'always' : 'auto',
      } satisfies Intl.NumberFormatOptions,
    },
  }
}
