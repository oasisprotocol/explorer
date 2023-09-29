import { accessIpfsUrl } from './ipfs'

const noPreviewUrl = 'https://whatever.com/image.jpg'

export const processNftImageUrl = (url: string | undefined): string => {
  if (!url) {
    return noPreviewUrl
  }
  const protocol = url.split(':')[0].toLowerCase()
  switch (protocol) {
    case 'http':
    case 'https':
    case 'ftp':
      return url
    case 'ipfs':
      return accessIpfsUrl(url)
    default:
      // TODO: look up the standard about what other protocols should be supported
      console.log("We don't know how to display an image specified using the", protocol, 'protocol!')
      return noPreviewUrl
  }
}
