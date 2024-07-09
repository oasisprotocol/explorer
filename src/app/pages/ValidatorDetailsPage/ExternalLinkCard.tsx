import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCardExternalLink } from 'app/components/Snapshots/SnapshotCardExternalLink'

type ExternalLinkCardProps = {
  label?: ReactNode
  link: string | undefined
}

export const ExternalLinkCard: FC<ExternalLinkCardProps> = ({ label, link }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('validator.externalLinkDescription')}
      label={label || link}
      title={t('validator.externalLink')}
      url={link}
    />
  )
}
