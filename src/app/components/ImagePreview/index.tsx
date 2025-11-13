import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { ImagePreviewDialog } from '@oasisprotocol/ui-library/src/components/dialog'
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
        <Button variant="ghost" onClick={handlePreviewOpen} className="p-0 h-auto w-auto">
          <img
            onError={onError}
            src={src}
            alt={label}
            style={{
              maxWidth: maxThumbnailSize,
              maxHeight: maxThumbnailSize,
            }}
          />
        </Button>
      </div>
      <ImagePreviewDialog open={previewOpen} onClose={handlePreviewClose} src={src} title={title} />
    </>
  )
}
