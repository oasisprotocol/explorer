/**
 * Get a shortened version of a string
 *
 * @param value The original string
 * @param trimStart How many characters to use at the beginning? (Minimum: 1)
 * @param trimEnd How many characters to use at the end? (Minimum: 0)
 * @param ellipsis What string should we use to indicate the shortening?
 */
export function trimLongString(value: string, trimStart = 6, trimEnd = 6, ellipsis = '…') {
  if (!value) return
  // We always want to show at least one character at the beginning and at the end
  const wantedStart = Math.max(trimStart, 1)
  // We might not want to show anything from the end of the string, but the number should not be negative
  const wantedEnd = Math.max(trimEnd, 0)
  const trimmedLength = wantedStart + ellipsis.length + wantedEnd
  if (trimmedLength > value.length) return value

  return `${value.slice(0, wantedStart)}${ellipsis}${trimEnd ? value.slice(-wantedEnd) : ''}`
}
