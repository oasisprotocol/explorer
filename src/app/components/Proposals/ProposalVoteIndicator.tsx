import { FC } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { CircleCheckIcon, CircleXIcon, CircleOffIcon } from 'lucide-react'
import { ProposalVoteValue } from '../../../types/vote'
import { AppErrors } from '../../../types/errors'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

const statusVariant: Record<ProposalVoteValue, 'success' | 'muted' | 'error'> = {
  [ProposalVoteValue.yes]: 'success',
  [ProposalVoteValue.abstain]: 'muted',
  [ProposalVoteValue.no]: 'error',
}

const getStatuses = (t: TFunction) => ({
  [ProposalVoteValue.abstain]: {
    icon: CircleOffIcon,
    label: t('networkProposal.vote.abstain'),
  },
  [ProposalVoteValue.yes]: {
    icon: CircleCheckIcon,
    label: t('networkProposal.vote.yes'),
  },
  [ProposalVoteValue.no]: {
    icon: CircleXIcon,
    label: t('networkProposal.vote.no'),
  },
})

type ProposalVoteIndicatorProps = {
  vote: ProposalVoteValue
}

export const ProposalVoteIndicator: FC<ProposalVoteIndicatorProps> = ({ vote }) => {
  const { t } = useTranslation()

  if (!ProposalVoteValue[vote]) {
    throw AppErrors.InvalidVote
  }

  const statusConfig = getStatuses(t)[vote]
  const IconComponent = statusConfig.icon

  return (
    <Badge variant={statusVariant[vote]}>
      {statusConfig.label}
      <IconComponent />
    </Badge>
  )
}
