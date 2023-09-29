export const ipfsUrlPrefix = 'ipfs://'

export const ipfsProxyPrefix = 'https://ipfs.io/ipfs/'

/**
 * Return a URL for accessing an IPFS asset via ipfs.io
 */
export const accessIpfsUrl = (url: string): string => {
  if (!url.toLowerCase().startsWith(ipfsUrlPrefix)) {
    console.log('Looking for', ipfsUrlPrefix, 'found', url.toLowerCase())
    throw new Error(`Invalid IPFS URL, doesn't start with ${ipfsUrlPrefix}: ${url}`)
  }
  return `${ipfsProxyPrefix}${url.substring(ipfsUrlPrefix.length)}`
}
