import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { ExternalLink } from 'lucide-react'
import { getHostname } from '../../utils/url'
import { SnapshotCardExternalLink } from '../../components/Snapshots/SnapshotCardExternalLink'

type ExternalLinkCardProps = {
  link: string | undefined
}

export const ExternalLinkCard: FC<ExternalLinkCardProps> = ({ link }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('validator.externalLinkDescription')}
      label={
        <div className="flex items-center gap-1">
          <Typography className="font-medium lowercase">{getHostname(link)}</Typography>
          <ExternalLink size={15} />
        </div>
      }
      title={t('validator.externalLink')}
      url={link}
    />
  )
}
