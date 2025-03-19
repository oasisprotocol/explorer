import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { TableAgeType } from '../../../types/table-age-type'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { tooltipDelay } from '../../../styles/theme'
import { getTimeZone } from '../../hooks/useFormattedTimestamp'

const StyledButton = styled(Button)(() => ({
  paddingLeft: '0px',
  paddingRight: '0px',
  minWidth: 'auto',
}))

type TableHeaderAgeProps = {
  label?: string
}

export const TableHeaderAge: FC<TableHeaderAgeProps> = ({ label }) => {
  const { t } = useTranslation()
  const {
    settings: { ageHeaderType },
    changeSetting,
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
          <StyledButton variant="text" onClick={() => changeSetting('ageHeaderType', TableAgeType.Distance)}>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {t('table.headers.dateTime.title')} {timeZone ? `(${timeZone})` : null}
            </Typography>
          </StyledButton>
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
          <StyledButton variant="text" onClick={() => changeSetting('ageHeaderType', TableAgeType.DateTime)}>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {label || t('common.age')}
            </Typography>
          </StyledButton>
        </Tooltip>
      )
  }
}
