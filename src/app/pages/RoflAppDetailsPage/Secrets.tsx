import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RoflAppSecrets } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'

type SecretsProps = {
  secrets: RoflAppSecrets
}

export const Secrets: FC<SecretsProps> = ({ secrets }) => {
  const { t } = useTranslation()

  if (!secrets || Object.keys(secrets).length === 0) {
    return <>{t('common.missing')}</>
  }

  return (
    <Box>
      {Object.keys(secrets).map(key => (
        <Box key={key}>
          <Typography
            variant="mono"
            component="span"
            sx={{
              wordWrap: 'break-word',
              pr: 3,
            }}
          >
            {key}:
          </Typography>
          <Typography variant="mono" sx={{ color: COLORS.grayMedium }}>
            {t('rofl.secretLength', { value: secrets[key].length })}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
