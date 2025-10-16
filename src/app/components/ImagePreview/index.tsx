import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/base/Button'
import { styled } from '@mui/material/styles'
import { ImagePreviewDialog } from '@oasisprotocol/ui-library/src/components/dialog'

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
      <div>
        <StyledButton onClick={handlePreviewOpen}>
          <StyledThumbnail onError={onError} src={src} alt={label} maxThumbnailSize={maxThumbnailSize} />
        </StyledButton>
      </div>
      <ImagePreviewDialog open={previewOpen} onClose={handlePreviewClose} src={src} title={title} />
    </>
  )
}
