import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useGetConsensusValidators, Validator } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { PieChart } from '../../components/charts/PieChart'
import { API_MAX_TOTAL_COUNT } from '../../config'

type ValidatorsStats = {
  label: string
  value: number
}

// TODO: remove if backend will provide validators stats
function countValidatorsState(t: TFunction, validators: Validator[] | undefined): ValidatorsStats[] {
  if (!validators) return []

  return [
    { label: t('validator.active'), value: validators.filter(v => v.active).length },
    { label: t('validator.inactive'), value: validators.filter(v => !v.active).length },
  ]
}

export const SnapshotValidators: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope

  const validatorsQuery = useGetConsensusValidators(
    network,
    { limit: API_MAX_TOTAL_COUNT },
    {
      query: {
        cacheTime: 0,
      },
    },
  )
  const validators = validatorsQuery.data?.data.validators

  return (
    <SnapshotCard title={t('validator.listTitle')}>
      <PieChart
        compact
        data={countValidatorsState(t, validators)}
        dataKey="value"
        formatters={{
          data: (value: number) => value.toLocaleString(),
          label: (status: string) => t('validator.groupStatus', { status }),
        }}
      />
    </SnapshotCard>
  )
}
