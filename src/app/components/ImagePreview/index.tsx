import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import { Button } from '@mui/base/Button'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledThumbnail = styled('img', {
  shouldForwardProp: prop => prop !== 'maxThumbnailSize',
})<{ maxThumbnailSize: string }>(({ maxThumbnailSize }) => ({
  maxWidth: maxThumbnailSize,
  maxHeight: maxThumbnailSize,
}))

const StyledButton = styled(Button)({
  cursor: 'pointer',
  border: 'none',
  background: 'none',
})

const StyledImage = styled('img')({
  maxWidth: '80dvw',
  maxHeight: ' 80dvh',
})

type ImagePreviewProps = {
  handlePreviewClose: () => void
  handlePreviewOpen: () => void
  onError: () => void
  previewOpen: boolean
  src: string
  title: string | undefined
  maxThumbnailSize: string
}

export const ImagePreview: FC<ImagePreviewProps> = ({
  handlePreviewClose,
  handlePreviewOpen,
  onError,
  previewOpen,
  src,
  title,
  maxThumbnailSize,
}) => {
  const { t } = useTranslation()
  const label = title || t('nft.imagePreview')

  return (
    <>
      <Box>
        <StyledButton onClick={handlePreviewOpen}>
          <StyledThumbnail onError={onError} src={src} alt={label} maxThumbnailSize={maxThumbnailSize} />
        </StyledButton>
      </Box>
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
            <StyledImage src={src} alt={label} />
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
