export function trimLongString(value: string, trimStart = 10, trimEnd = 8, splice = '...') {
  if (!value) {
    return
  }
  const trimmedLength = trimStart + 3 + trimEnd
  if (trimmedLength > value.length) {
    return value
  }

  return `${value.slice(0, trimStart)}${splice}${trimEnd ? value.slice(-trimEnd) : ''}`
}
