import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { styled } from '@mui/material/styles'
import { processNftImageUrl } from 'app/utils/nft-images'
import { hasValidProtocol } from 'app/utils/url'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'
import { useScreenSize } from 'app/hooks/useScreensize'
import { COLORS } from 'styles/theme/colors'
import { checkContentType } from 'app/utils/ipfs'

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

const StyledVideo = styled('video', {
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

const StyledBox = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  fontSize: '14px',
  fontWeight: 500,
  color: COLORS.white,
  transition: 'opacity, background-color 250ms ease-in-out',
  opacity: 0,
  '&:hover, &:focus-visible': {
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  const [contentType, setContentType] = useState<string>('')

  useEffect(() => {
    async function fetchContentType() {
      try {
        const url = processNftImageUrl(instance?.image)
        const type = await checkContentType(url)
        setContentType(type)
      } catch (error) {
        console.error('Error fetching content type:', error)
      }
    }

    fetchContentType()
  }, [instance?.image])

  return (
    <Link component={RouterLink} to={to} sx={{ display: 'flex', position: 'relative' }}>
      {hasValidProtocol(instance.image) && !imageLoadError ? (
        (contentType === 'image' && (
          <StyledImage
            onError={() => setImageLoadError(true)}
            src={processNftImageUrl(instance.image)}
            alt={getNftInstanceLabel(instance)}
            loading="lazy"
            isMobile={isMobile}
          />
        )) ||
        (contentType === 'video' && (
          <StyledVideo
            onError={() => setImageLoadError(true)}
            src={processNftImageUrl(instance.image)}
            isMobile={isMobile}
          />
        ))
      ) : (
        <NoPreview placeholderSize={isMobile ? minMobileSize : minSize} />
      )}
      <StyledBox gap={3}>
        <OpenInBrowserIcon sx={{ fontSize: '40px' }} />
        {t('common.view')}
      </StyledBox>
    </Link>
  )
}
