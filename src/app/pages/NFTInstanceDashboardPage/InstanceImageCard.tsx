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
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { styled } from '@mui/material/styles'
import { EvmNft } from 'oasis-nexus/api'
import { isNftImageUrlValid, processNftImageUrl } from '../../utils/nft-images'
import { COLORS } from '../../../styles/theme/colors'

const maxImageSize = '350px'

export const StyledImage = styled('img')({
  maxWidth: maxImageSize,
  maxHeight: maxImageSize,
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

// Temporary solution until we have a proper image modal viewer
const FullScreenButton: FC<{ darkMode: boolean; imageUrl: string }> = ({ darkMode, imageUrl }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('nft.openInFullscreen')}>
      <StyledButton
        darkMode={darkMode}
        component={Link}
        href={imageUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
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
          {isLoading && <Skeleton variant="rectangular" width={maxImageSize} height={maxImageSize} />}
          {isFetched && nft && !isNftImageUrlValid(nft.image) && (
            <Box
              paddingY={6}
              gap={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: COLORS.grayMedium2,
              }}
            >
              <NotInterestedIcon sx={{ fontSize: '72px' }} />
              {t('nft.noPreview')}
            </Box>
          )}
          {isFetched && nft && isNftImageUrlValid(nft.image) && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <StyledImage src={processNftImageUrl(nft.image)} alt={nft.name} />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'right',
                  gap: 3,
                }}
              >
                <FullScreenButton darkMode={darkMode} imageUrl={processNftImageUrl(nft.image)} />
                <DarkModeSwitch darkMode={darkMode} onSetDarkMode={setDarkMode} />
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
