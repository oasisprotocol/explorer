import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { TableAgeType } from '../../../types/table-age-type'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { tooltipDelay } from '../../../styles/theme'
import { getTimeZone } from '../../hooks/useFormattedTimestamp'

export const TableHeaderAge: FC = () => {
  const { t } = useTranslation()
  const {
    state: { ageHeaderType },
    setAgeHeaderType,
  } = useLocalSettings()

  switch (ageHeaderType) {
    case TableAgeType.DateTime: {
      const timeZone = getTimeZone()

      return (
        <Tooltip
          title={t('table.headers.dateTime.tooltipTitle')}
          enterDelay={tooltipDelay}
          leaveDelay={0}
          placement={'top'}
        >
          <Button variant="text" onClick={() => setAgeHeaderType(TableAgeType.Distance)}>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {t('table.headers.dateTime.title')} {timeZone ? `(${timeZone})` : null}
            </Typography>
          </Button>
        </Tooltip>
      )
    }
    case TableAgeType.Distance:
    default:
      return (
        <Tooltip
          title={t('table.headers.age.tooltipTitle')}
          enterDelay={tooltipDelay}
          leaveDelay={0}
          placement={'top'}
        >
          <Button variant="text" onClick={() => setAgeHeaderType(TableAgeType.DateTime)}>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {t('common.age')}
            </Typography>
          </Button>
        </Tooltip>
      )
  }
}
