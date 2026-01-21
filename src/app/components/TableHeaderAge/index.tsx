import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TableAgeType } from '../../../types/table-age-type'
import { exhaustedTypeWarning } from '../../../types/errors'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { TableHeaderToggle } from '../TableHeaderToggle'

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
      return (
        <TableHeaderToggle
          label={label || t('common.age')}
          onClick={() => changeSetting('ageHeaderType', TableAgeType.Distance)}
          tooltipTitle={t('table.headers.dateTime.tooltipTitle')}
        />
      )
    }
    case TableAgeType.Distance:
      return (
        <TableHeaderToggle
          label={label || t('common.age')}
          onClick={() => changeSetting('ageHeaderType', TableAgeType.DateTime)}
          tooltipTitle={t('table.headers.age.tooltipTitle')}
        />
      )
    default:
      exhaustedTypeWarning('Unknown age header type', ageHeaderType)
      return null
  }
}
