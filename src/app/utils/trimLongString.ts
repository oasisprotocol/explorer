export function trimLongString(value: string, trimStart = 6, trimEnd = 6, ellipsis = '…') {
  if (!value) {
    return
  }
  const trimmedLength = trimStart + ellipsis.length + trimEnd
  if (trimmedLength > value.length) {
    return value
  }

  return `${value.slice(0, trimStart)}${ellipsis}${trimEnd ? value.slice(-trimEnd) : ''}`
}
