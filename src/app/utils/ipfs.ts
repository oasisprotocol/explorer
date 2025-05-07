import axios from 'axios'
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

/**
 * Return content-type of the asset uploaded on the provided link
 */
export const checkContentType = async (url: string) => {
  try {
    const response = await axios.head(url);
    const contentType = response.headers['content-type'];

    if (contentType && contentType.startsWith('image')) {
      return 'image';
    } else if (contentType && contentType.startsWith('video')) {
      return 'video';
    } else {
      return 'unknown';
    }
  } catch (error) {
    console.error("Error fetching NFT resource:", error);
    return 'error';
  }
}