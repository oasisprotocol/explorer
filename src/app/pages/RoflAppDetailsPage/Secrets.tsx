import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { RoflAppSecrets } from '../../../oasis-nexus/api'

type SecretsProps = {
  secrets: RoflAppSecrets
}

export const Secrets: FC<SecretsProps> = ({ secrets }) => {
  const { t } = useTranslation()

  if (!secrets || secrets.length === 0) {
    return <>{t('common.missing')}</>
  }

  return (
    <table>
      {Object.keys(secrets).map(key => (
        <tr key={key}>
          <td>
            <Typography
              variant="mono"
              component="span"
              sx={{
                wordWrap: 'break-word',
                pr: 5,
              }}
            >
              {key}:
            </Typography>
          </td>
          <td>
            <Typography variant="mono">{secrets[key]}</Typography>
          </td>
        </tr>
      ))}
    </table>
  )
}
