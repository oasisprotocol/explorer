import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Button } from '@mui/base/Button'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import ContrastIcon from '@mui/icons-material/Contrast'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { styled } from '@mui/material/styles'
import { EvmNft } from 'oasis-nexus/api'
import { isNftImageUrlValid, processNftImageUrl } from '../../utils/nft-images'
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
  const [darkMode, setDarkMode] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const handlePreviewOpen = () => setPreviewOpen(true)
  const handlePreviewClose = () => setPreviewOpen(false)

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
          }}
        >
          {isLoading && <Skeleton variant="rectangular" width={imageSize} height={imageSize} />}
          {isFetched && nft && !isNftImageUrlValid(nft.image) && <NoPreview placeholderSize={imageSize} />}
          {isFetched && nft && isNftImageUrlValid(nft.image) && (
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
