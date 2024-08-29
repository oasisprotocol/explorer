import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Validator } from '../../../oasis-nexus/api'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { PieChart } from '../../components/charts/PieChart'

type ValidatorsStats = {
  label: string
  value: number
}

function countValidatorsState(t: TFunction, validators: Validator[] | undefined): ValidatorsStats[] {
  if (!validators) return []

  return [
    { label: t('validator.active'), value: validators.filter(v => v.in_validator_set).length },
    { label: t('validator.waiting'), value: validators.filter(v => !v.in_validator_set && v.active).length },
    { label: t('validator.inactive'), value: validators.filter(v => !v.active).length },
  ]
}

type SnapshotValidatorsProps = {
  validators: Validator[] | undefined
}

export const SnapshotValidators: FC<SnapshotValidatorsProps> = ({ validators }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCard title={t('validator.listTitle')}>
      {!!validators?.length && (
        <PieChart
          compact
          data={countValidatorsState(t, validators)}
          dataKey="value"
          formatters={{
            data: (value: number) => value.toLocaleString(),
            label: (status: string) => t('validator.groupStatus', { status }),
          }}
        />
      )}
    </SnapshotCard>
  )
}
