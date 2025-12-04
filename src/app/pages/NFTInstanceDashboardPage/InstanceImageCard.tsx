import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { EvmNft } from 'oasis-nexus/api'
import { processNftImageUrl } from '../../utils/nft-images'
import { isUrlSafe } from '../../utils/url'
import { ImagePreview } from '../../components/ImagePreview'
import { NoPreview } from '../../components/NoPreview'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Contrast, Maximize2 } from 'lucide-react'

const imageSize = '350px'

const DarkModeSwitch: FC<{ darkMode: boolean; onSetDarkMode: (darkMode: boolean) => void }> = ({
  darkMode,
  onSetDarkMode,
}) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('nft.switchBackgroundColor')}>
      <Button
        onClick={() => onSetDarkMode(!darkMode)}
        aria-label={t('nft.switchBackgroundColor')}
        variant="ghost"
        size="icon"
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center border-none',
          darkMode
            ? 'bg-background text-muted-foreground hover:bg-muted/50'
            : 'bg-muted text-foreground hover:bg-muted/70',
        )}
      >
        <Contrast />
      </Button>
    </Tooltip>
  )
}

const FullScreenButton: FC<{ darkMode: boolean; onClick: () => void }> = ({ darkMode, onClick }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('nft.openInFullscreen')}>
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn(
          'rounded-full',
          darkMode
            ? 'bg-background text-muted-foreground hover:bg-muted/50'
            : 'bg-muted text-foreground hover:bg-muted/70',
        )}
      >
        <Maximize2 />
      </Button>
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
    <Card variant="layout" className={cn(darkMode ? 'bg-gray-900' : 'bg-white')}>
      <CardContent>
        <div className="flex flex-col items-center justify-between" style={{ minHeight: imageSize }}>
          {isLoading && <Skeleton className="w-[350px] h-[350px]" />}
          {/* API did not process NFT data fully */}
          {isFetched && !nft?.image && <NoPreview placeholderSize={imageSize} />}
          {/* API processed NFT data, but image prop is not valid image source */}
          {isFetched && nft?.image && imageLoadError && (
            <div className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <NoPreview placeholderSize={imageSize} />
                {isUrlSafe(nft.image) && (
                  <Link href={nft.image} rel="noopener noreferrer" target="_blank">
                    {t('nft.openInNewTab')}
                  </Link>
                )}
              </div>
            </div>
          )}
          {isFetched && nft && isUrlSafe(nft.image) && !imageLoadError && (
            <>
              <div className="flex justify-center items-center">
                <ImagePreview
                  handlePreviewClose={handlePreviewClose}
                  handlePreviewOpen={handlePreviewOpen}
                  previewOpen={previewOpen}
                  src={processNftImageUrl(nft.image)}
                  onError={() => setImageLoadError(true)}
                  title={nft.name}
                  maxThumbnailSize={imageSize}
                />
              </div>
              <div className="w-full flex justify-end gap-3">
                <FullScreenButton darkMode={darkMode} onClick={handlePreviewOpen} />
                <DarkModeSwitch darkMode={darkMode} onSetDarkMode={setDarkMode} />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
