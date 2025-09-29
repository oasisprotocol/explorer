import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflAppSecrets } from '../../../oasis-nexus/api'

type SecretsProps = {
  secrets: RoflAppSecrets
}

export const Secrets: FC<SecretsProps> = ({ secrets }) => {
  const { t } = useTranslation()

  if (!secrets || Object.keys(secrets).length === 0) {
    return <>{t('common.missing')}</>
  }

  return (
    <div>
      {Object.keys(secrets).map(key => (
        <div key={key} className="flex flex-wrap gap-x-1">
          <span className="font-medium break-words">{key}:</span>
          <span className="text-muted-foreground">
            {t('rofl.secretLength', { value: secrets[key].length })}
          </span>
        </div>
      ))}
    </div>
  )
}
