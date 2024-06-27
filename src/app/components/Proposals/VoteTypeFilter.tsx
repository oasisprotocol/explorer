import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ProposalVoteValue, VoteType } from '../../../types/vote'
import { FilterButtons } from '../FilterButtons'

type VoteTypeFilterProps = {
  onSelect: (voteType: VoteType) => void
  value?: VoteType
}

export const VoteTypeFilter: FC<VoteTypeFilterProps> = props => {
  const { t } = useTranslation()
  const options: { label: string; value: VoteType }[] = [
    {
      label: t('networkProposal.vote.all'),
      value: 'any',
    },
    {
      label: t('networkProposal.vote.yes'),
      value: ProposalVoteValue.yes,
    },
    {
      label: t('networkProposal.vote.abstain'),
      value: ProposalVoteValue.abstain,
    },
    {
      label: t('networkProposal.vote.no'),
      value: ProposalVoteValue.no,
    },
  ]

  return <FilterButtons options={options} {...props} />
}
