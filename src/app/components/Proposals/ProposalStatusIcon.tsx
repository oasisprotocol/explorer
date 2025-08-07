import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { ProposalState } from '../../../oasis-nexus/api'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

const statusVariant: Record<ProposalState, 'partial-success' | 'success' | 'error' | 'destructive'> = {
  [ProposalState.active]: 'partial-success',
  [ProposalState.passed]: 'success',
  [ProposalState.rejected]: 'error',
  [ProposalState.failed]: 'destructive',
}

const getStatuses = (t: TFunction) => ({
  [ProposalState.active]: {
    label: t('networkProposal.state.active'),
  },
  [ProposalState.passed]: {
    label: t('networkProposal.state.passed'),
  },
  [ProposalState.rejected]: {
    label: t('networkProposal.state.rejected'),
  },
  [ProposalState.failed]: {
    label: t('networkProposal.state.failed'),
  },
})

type ProposalStatusIconProps = {
  status: ProposalState
}

export const ProposalStatusIcon: FC<ProposalStatusIconProps> = ({ status }) => {
  const { t } = useTranslation()

  if (!ProposalState[status]) {
    return null
  }

  const statusConfig = getStatuses(t)[status]

  return <Badge variant={statusVariant[status]}>{statusConfig.label}</Badge>
}
