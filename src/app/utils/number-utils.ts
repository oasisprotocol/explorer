import BigNumber from 'bignumber.js'

export function fromBaseUnits(valueInBaseUnits: string, decimals: number): string {
  const value = new BigNumber(valueInBaseUnits).shiftedBy(-decimals) // / 10 ** decimals
  if (value.isNaN()) {
    throw new Error(`Not a number in fromBaseUnits(${valueInBaseUnits})`)
  }
  return value.toFixed()
}

export const getGasPrice = ({ fee = '', gasUsed = '' }): string | null => {
  if (!fee || !gasUsed || gasUsed === '0') {
    return null
  }

  return BigNumber(fee).div(BigNumber(gasUsed)).toFixed()
}

export const convertToNano = (value: string): string => fromBaseUnits(value, -9)

export const calculatePercentage = (
  value: number | string | undefined,
  total: number | string | undefined,
  asPercentage: boolean = true,
): number | null => {
  if (value === undefined || value === null || total === undefined || total === null) {
    return null
  }

  const valueBN = new BigNumber(value)
  const totalBN = new BigNumber(total)

  if (!valueBN || !totalBN || totalBN.lte(0)) {
    return null
  }

  const result = valueBN.div(totalBN)
  return asPercentage ? result.multipliedBy(100).toNumber() : result.toNumber()
}
