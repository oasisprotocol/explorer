import { BigNumber } from 'bignumber.js'
import { useTranslation } from 'react-i18next'

export type NumberFormattingParameters = Partial<BigNumber.Format> & {
  // Additional features which are not natively supported by BigNumber

  decimalPlaces?: number
  maximumFractionDigits?: number
  roundingMode?: BigNumber.RoundingMode
  unit?: string
  countKey?: string
}

export const useFormatNumber = () => {
  const { t } = useTranslation()
  return (
    inputNumber: number | string | BigNumber.Instance | undefined,
    format: NumberFormattingParameters = {},
  ): string | undefined => {
    if (inputNumber === undefined) return
    const { decimalPlaces, maximumFractionDigits, roundingMode, unit, countKey, ...formatting } = format
    if (!!unit && !!countKey) {
      throw new Error("Please don't try to use unit and countKey together! They are incompatible.")
    }
    let number =
      typeof inputNumber === 'number'
        ? BigNumber(inputNumber.toString(2), 2) // This is required to keep all precision
        : BigNumber(inputNumber)
    if (maximumFractionDigits !== undefined) {
      number = BigNumber(number.toFixed(maximumFractionDigits, roundingMode))
    }
    const wantedFormat = { ...BigNumber.config().FORMAT, ...formatting }
    const numberString =
      decimalPlaces === undefined
        ? number.toFormat(wantedFormat)
        : roundingMode === undefined
        ? number.toFormat(decimalPlaces, wantedFormat)
        : number.toFormat(decimalPlaces, roundingMode, wantedFormat)
    if (unit) {
      const formattedUnit = Intl.NumberFormat(undefined, {
        style: 'unit',
        unit,
        unitDisplay: 'long',
      })
        .formatToParts(number.toNumber())
        .find(p => p.type === 'unit')!.value
      return `${numberString} ${formattedUnit}`
    } else if (countKey) {
      const num: number = number.toNumber()
      if (num === 1) {
        return t(countKey as any, { count: 1 })
      } else {
        const i18nForm = t('common.number', { value: num })
        return t(countKey as any, { count: num }).replace(i18nForm, numberString)
      }
    } else {
      return numberString
    }
  }
}
