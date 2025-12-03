import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Ban } from 'lucide-react'

type NoPreviewProps = {
  placeholderSize: string
}

export const NoPreview: FC<NoPreviewProps> = ({ placeholderSize }) => {
  const { t } = useTranslation()

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground font-semibold bg-neutral-200"
      style={{
        height: placeholderSize,
        width: placeholderSize,
      }}
    >
      <Ban size={50} color="#A7A7A7" />
      {t('nft.noPreview')}
    </div>
  )
}
