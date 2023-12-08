import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { styled } from '@mui/material/styles'
import { isNftImageUrlValid, processNftImageUrl } from 'app/utils/nft-images'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'
import { useScreenSize } from 'app/hooks/useScreensize'
import { COLORS } from 'styles/theme/colors'

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

  return (
    <Link component={RouterLink} to={to} sx={{ display: 'flex', position: 'relative' }}>
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
      <StyledBox gap={3}>
        <OpenInBrowserIcon sx={{ fontSize: '40px' }} />
        {t('common.view')}
      </StyledBox>
    </Link>
  )
}
