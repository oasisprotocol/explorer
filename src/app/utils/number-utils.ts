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
