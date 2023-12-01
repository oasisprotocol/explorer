import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { isNftImageUrlValid, processNftImageUrl } from 'app/utils/nft-images'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'

const imageSize = '210px'

const StyledImage = styled('img')({
  width: imageSize,
  height: imageSize,
})

type ImageListItemImageProps = {
  instance: EvmNft
  to: string
}

export const ImageListItemImage: FC<ImageListItemImageProps> = ({ instance, to }) => {
  return (
    <Link component={RouterLink} to={to}>
      {isNftImageUrlValid(instance.image) ? (
        <StyledImage
          src={processNftImageUrl(instance.image)}
          alt={getNftInstanceLabel(instance)}
          loading="lazy"
        />
      ) : (
        <NoPreview placeholderSize={imageSize} />
      )}
    </Link>
  )
}
