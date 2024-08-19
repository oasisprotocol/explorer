export const getTokenMarketCap = (
  relativeTotalValue: number | undefined,
  rosePriceInUsd: number | undefined,
) => {
  if (typeof relativeTotalValue !== 'number' || !rosePriceInUsd) {
    return undefined
  }
  // Convert atto wROSE
  const totalValueInWRose = relativeTotalValue / Math.pow(10, 18)
  const totalValueInUsd = totalValueInWRose * rosePriceInUsd
  return totalValueInUsd
}
