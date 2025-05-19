// `http://` images can not be previewed (blocked mixed content)
// `ftp://` is obsolete https://chromestatus.com/feature/6199005675520000
const validProtocols = ['http:', 'https:', 'ftp:', 'ipfs:', 'data:', 'mailto:']

/** Blocks dangerous URLs that start with "javascript:". When we upgrade to React@19 that should block them too. */
export const isUrlSafe = (url: string | undefined): boolean => {
  if (!url) {
    return false
  }

  try {
    const parsedUrl = new URL(url)
    return validProtocols.includes(parsedUrl.protocol)
  } catch (error) {
    return false
  }
}

export const getHostname = (url: string | undefined): string => {
  if (!url) {
    return ''
  }

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch (error) {
    return ''
  }
}
