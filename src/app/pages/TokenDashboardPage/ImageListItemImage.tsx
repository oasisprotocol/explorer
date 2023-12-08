import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { isNftImageUrlValid, processNftImageUrl } from 'app/utils/nft-images'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'
import { useScreenSize } from 'app/hooks/useScreensize'

const minMobileSize = '150px'
const mobileSize = '100%'
const imageSize = '210px'

const StyledImage = styled('img', {
  shouldForwardProp: prop => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  minWidth: isMobile ? minMobileSize : imageSize,
  minHeight: isMobile ? minMobileSize : imageSize,
  width: isMobile ? mobileSize : imageSize,
  height: isMobile ? mobileSize : imageSize,
  objectFit: 'cover',
}))

type ImageListItemImageProps = {
  instance: EvmNft
  to: string
}

export const ImageListItemImage: FC<ImageListItemImageProps> = ({ instance, to }) => {
  const { isMobile } = useScreenSize()

  return (
    <Link component={RouterLink} to={to}>
      {isNftImageUrlValid(instance.image) ? (
        <StyledImage
          src={processNftImageUrl(instance.image)}
          alt={getNftInstanceLabel(instance)}
          loading="lazy"
          isMobile={isMobile}
        />
      ) : (
        <NoPreview placeholderSize={imageSize} />
      )}
    </Link>
  )
}
