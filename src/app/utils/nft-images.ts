import { AppError, AppErrors } from 'types/errors'
import { accessIpfsUrl } from './ipfs'
import { isUrlSafe } from './url'

export const processNftImageUrl = (url: string | undefined): string => {
  if (!url || !isUrlSafe(url)) {
    throw new AppError(AppErrors.InvalidUrl)
  }

  if (url && url.startsWith('ipfs:')) {
    return accessIpfsUrl(url)
  }

  return url
}
