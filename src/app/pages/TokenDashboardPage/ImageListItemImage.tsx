import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { styled } from '@mui/material/styles'
import { processNftImageUrl } from 'app/utils/nft-images'
import { isUrlSafe } from 'app/utils/url'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'
import { useScreenSize } from 'app/hooks/useScreensize'

const minMobileSize = '150px'
const minSize = '210px'

const StyledImage = styled('img', {
  shouldForwardProp: prop => prop !== 'isMobile',
})<{ isMobile: boolean }>(({ isMobile }) => ({
  minWidth: isMobile ? minMobileSize : minSize,
  minHeight: isMobile ? minMobileSize : minSize,
  width: '100%',
  height: '100%',
  maxHeight: minSize,
  objectFit: 'cover',
  transition: 'opacity 250ms ease-in-out',
  '&:hover, &:focus-visible': {
    opacity: 0.15,
  },
}))

type ImageListItemImageProps = {
  instance: EvmNft
  to: string
}

export const ImageListItemImage: FC<ImageListItemImageProps> = ({ instance, to }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const [imageLoadError, setImageLoadError] = useState(false)

  return (
    <Link component={RouterLink} to={to} sx={{ display: 'flex', position: 'relative' }}>
      {isUrlSafe(instance.image) && !imageLoadError ? (
        <StyledImage
          onError={() => setImageLoadError(true)}
          src={processNftImageUrl(instance.image)}
          alt={getNftInstanceLabel(instance)}
          loading="lazy"
          isMobile={isMobile}
        />
      ) : (
        <NoPreview placeholderSize={isMobile ? minMobileSize : minSize} />
      )}
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 text-sm font-medium text-white opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity transition-colors duration-300 hover:bg-black/80 focus-visible:bg-black/80">
        <OpenInBrowserIcon sx={{ fontSize: '40px' }} />
        {t('common.view')}
      </div>
    </Link>
  )
}
