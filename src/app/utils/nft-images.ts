import { AppError, AppErrors } from 'types/errors'
import { accessIpfsUrl } from './ipfs'
import { hasValidProtocol } from './url'

export const processNftImageUrl = (url: string | undefined): string => {
  if (!url || !hasValidProtocol(url)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (url && url.startsWith('ipfs:')) {
    return accessIpfsUrl(url)
  }

  return url
}
