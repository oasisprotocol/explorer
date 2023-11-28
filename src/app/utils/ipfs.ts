import { ipfs } from './externalLinks'

export const ipfsUrlPrefix = 'ipfs://'

/**
 * Return a URL for accessing an IPFS asset via ipfs.io
 */
export const accessIpfsUrl = (url: string): string => {
  if (!url.toLowerCase().startsWith(ipfsUrlPrefix)) {
    console.log('Looking for', ipfsUrlPrefix, 'found', url.toLowerCase())
    throw new Error(`Invalid IPFS URL, doesn't start with ${ipfsUrlPrefix}: ${url}`)
  }
  return `${ipfs.proxyPrefix}${url.substring(ipfsUrlPrefix.length)}`
}
