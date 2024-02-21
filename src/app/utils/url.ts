const validProtocols = ['http:', 'https:', 'ftp:', 'ipfs:', 'data:']

export const hasValidProtocol = (url: string | undefined): boolean => {
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
