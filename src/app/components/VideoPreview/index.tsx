import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledThumbnailContainer = styled(Box)({
  position: 'relative',
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledThumbnail = styled('video', {
  shouldForwardProp: prop => prop !== 'maxThumbnailSize',
})<{ maxThumbnailSize: string }>(({ maxThumbnailSize }) => ({
  maxWidth: maxThumbnailSize,
  maxHeight: maxThumbnailSize,
}))

const PlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'transparent',
  color: COLORS.white,
  fontSize: 'inherit',
  '& .MuiSvgIcon-root': {
    fontSize: '48px',
  },
})

const StyledVideo = styled('video')({
  maxWidth: '80dvw',
  maxHeight: '80dvh',
})

type VideoPreviewProps = {
  handlePreviewClose: () => void
  handlePreviewOpen: () => void
  onError: () => void
  previewOpen: boolean
  src: string
  title: string | undefined
  maxThumbnailSize: string
}

export const VideoPreview: FC<VideoPreviewProps> = ({
  handlePreviewClose,
  handlePreviewOpen,
  previewOpen,
  onError,
  src,
  title,
  maxThumbnailSize,
}) => {
  const { t } = useTranslation()
  const label = title || t('nft.videoPreview')

  return (
    <>
      <StyledThumbnailContainer>
        <StyledThumbnail onError={onError} src={src} maxThumbnailSize={maxThumbnailSize} />
        <PlayButton aria-label="Play" onClick={handlePreviewOpen}>
          <PlayCircleFilledWhiteIcon />
        </PlayButton>
      </StyledThumbnailContainer>
      <Modal
        aria-labelledby={label}
        open={previewOpen}
        onClose={handlePreviewClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={previewOpen}>
          <Box sx={{ position: 'absolute' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: title ? 'space-between' : 'flex-end',
                alignItems: 'center',
                mb: 3,
              }}
            >
              {title && (
                <Typography fontSize="24px" fontWeight={700} color={COLORS.white}>
                  {title}
                </Typography>
              )}
              <IconButton aria-label="Close" onClick={handlePreviewClose}>
                <CancelIcon sx={{ fontSize: '40px', color: COLORS.white }} />
              </IconButton>
            </Box>
            <StyledVideo src={src} autoPlay loop />
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
