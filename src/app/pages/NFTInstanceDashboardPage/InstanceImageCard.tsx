import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Button } from '@mui/base/Button'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import ContrastIcon from '@mui/icons-material/Contrast'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { styled } from '@mui/material/styles'
import { EvmNft } from 'oasis-nexus/api'
import { processNftImageUrl } from '../../utils/nft-images'
import { isUrlSafe } from '../../utils/url'
import { COLORS } from '../../../styles/theme/colors'
import { ImagePreview } from '../../components/ImagePreview'
import { NoPreview } from '../../components/NoPreview'

const imageSize = '350px'

export const StyledImage = styled('img')({
  maxWidth: imageSize,
  maxHeight: imageSize,
})

const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'darkMode',
})<{ darkMode: boolean }>(({ darkMode }) => ({
  cursor: 'pointer',
  border: 'none',
  width: 36,
  height: 36,
  borderRadius: 18,
  background: darkMode ? COLORS.white : COLORS.grayMedium,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: darkMode ? COLORS.grayMedium : COLORS.white,
}))

const DarkModeSwitch: FC<{ darkMode: boolean; onSetDarkMode: (darkMode: boolean) => void }> = ({
  darkMode,
  onSetDarkMode,
}) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('nft.switchBackgroundColor')}>
      <StyledButton
        darkMode={darkMode}
        onClick={() => onSetDarkMode(!darkMode)}
        aria-label={t('nft.switchBackgroundColor')}
      >
        <ContrastIcon />
      </StyledButton>
    </Tooltip>
  )
}

const FullScreenButton: FC<{ darkMode: boolean; onClick: () => void }> = ({ darkMode, onClick }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('nft.openInFullscreen')}>
      <StyledButton darkMode={darkMode} onClick={onClick}>
        <OpenInFullIcon />
      </StyledButton>
    </Tooltip>
  )
}

type InstanceImageCardProps = {
  nft: EvmNft | undefined
  isFetched: boolean
  isLoading: boolean
}

export const InstanceImageCard: FC<InstanceImageCardProps> = ({ isFetched, isLoading, nft }) => {
  const { t } = useTranslation()
  const [darkMode, setDarkMode] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const handlePreviewOpen = () => setPreviewOpen(true)
  const handlePreviewClose = () => setPreviewOpen(false)
  const [imageLoadError, setImageLoadError] = useState(false)

  return (
    <Card
      sx={{
        background: darkMode ? COLORS.grayExtraDark : COLORS.white,
      }}
    >
      <CardContent>
        <Box
          sx={{
            background: darkMode ? COLORS.grayExtraDark : COLORS.white,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: imageSize,
          }}
        >
          {isLoading && <Skeleton variant="rectangular" width={imageSize} height={imageSize} />}
          {/* API did not process NFT data fully */}
          {isFetched && !nft?.image && <NoPreview placeholderSize={imageSize} />}
          {/* API processed NFT data, but image prop is not valid image source */}
          {isFetched && nft?.image && imageLoadError && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <NoPreview placeholderSize={imageSize} />
                {isUrlSafe(nft.image) && (
                  <Link href={nft.image} rel="noopener noreferrer" target="_blank">
                    {t('nft.openInNewTab')}
                  </Link>
                )}
              </Box>
            </Box>
          )}
          {isFetched && nft && isUrlSafe(nft.image) && !imageLoadError && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ImagePreview
                  handlePreviewClose={handlePreviewClose}
                  handlePreviewOpen={handlePreviewOpen}
                  previewOpen={previewOpen}
                  src={processNftImageUrl(nft.image)}
                  onError={() => setImageLoadError(true)}
                  title={nft.name}
                  maxThumbnailSize={imageSize}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'right',
                  gap: 3,
                }}
              >
                <FullScreenButton darkMode={darkMode} onClick={handlePreviewOpen} />
                <DarkModeSwitch darkMode={darkMode} onSetDarkMode={setDarkMode} />
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
