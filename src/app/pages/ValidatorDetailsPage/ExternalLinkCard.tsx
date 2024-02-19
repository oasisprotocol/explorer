import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCardExternalLink } from 'app/components/Snapshots/SnapshotCardExternalLink'

type ExternalLinkCardProps = {
  link?: string
}

export const ExternalLinkCard: FC<ExternalLinkCardProps> = ({ link }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('validator.externalLinkDescriotion')}
      label={link}
      title={t('validator.externalLink')}
      url={link}
    />
  )
}
