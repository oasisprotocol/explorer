import { AppError, AppErrors } from 'types/errors'
import { accessIpfsUrl } from './ipfs'

const validProtocols = ['http:', 'https:', 'ftp:', 'ipfs:']

export const isNftImageUrlValid = (url: string | undefined): boolean => {
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

export const processNftImageUrl = (url: string | undefined): string => {
  if (!url || !isNftImageUrlValid(url)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (url && url.startsWith('ipfs:')) {
    return accessIpfsUrl(url)
  }

  return url
}
