import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SnapshotCardExternalLink } from 'app/components/Snapshots/SnapshotCardExternalLink'

type ExternalLinkCardProps = {
  link?: string

  /**
   * Should we accept "mailto:" links?
   *
   * Those are more dangerous than other types, since they can
   * facilitate displaying malicious URLs like javascript: and mailto:?attach=
   *
   * In order to prevent this, only enable this flag if we can be sure that the link is safe.
   */
  emailAccepted?: boolean
}

export const ExternalLinkCard: FC<ExternalLinkCardProps> = ({ link, emailAccepted }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('validator.externalLinkDescriotion')}
      label={link}
      title={t('validator.externalLink')}
      url={link}
      emailAccepted={emailAccepted}
    />
  )
}
