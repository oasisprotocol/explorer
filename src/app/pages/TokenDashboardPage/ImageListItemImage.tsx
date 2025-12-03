import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { processNftImageUrl } from 'app/utils/nft-images'
import { isUrlSafe } from 'app/utils/url'
import { NoPreview } from '../../components/NoPreview'
import { getNftInstanceLabel } from '../../utils/nft'
import { EvmNft } from '../../../oasis-nexus/api'
import { useScreenSize } from 'app/hooks/useScreensize'
import { MonitorUp } from 'lucide-react'

const minMobileSize = '150px'
const minSize = '210px'

type ImageListItemImageProps = {
  instance: EvmNft
  to: string
}

export const ImageListItemImage: FC<ImageListItemImageProps> = ({ instance, to }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const [imageLoadError, setImageLoadError] = useState(false)

  return (
    <Link asChild className="flex relative">
      <RouterLink to={to}>
        {isUrlSafe(instance.image) && !imageLoadError ? (
          <img
            onError={() => setImageLoadError(true)}
            src={processNftImageUrl(instance.image)}
            alt={getNftInstanceLabel(instance)}
            loading="lazy"
            style={{
              minWidth: isMobile ? minMobileSize : minSize,
              minHeight: isMobile ? minMobileSize : minSize,
              maxHeight: minSize,
            }}
            className="w-full h-full object-cover transition-opacity duration-200 ease-in-out hover:opacity-15 focus-visible:opacity-15"
          />
        ) : (
          <NoPreview placeholderSize={isMobile ? minMobileSize : minSize} />
        )}
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 text-sm font-medium text-white opacity-0 hover:opacity-100 focus-visible:opacity-100 transition-opacity transition-colors duration-300 hover:bg-black/80 focus-visible:bg-black/80">
          <MonitorUp size={40} />
          {t('common.view')}
        </div>
      </RouterLink>
    </Link>
  )
}
