import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { ProposalVoteValue, VoteType } from '../../../types/vote'

type VoteTypeFilterProps = {
  onSelect: (voteType: VoteType) => void
  value?: VoteType
}

export const VoteTypeFilter: FC<VoteTypeFilterProps> = ({ onSelect, value }) => {
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

  return (
    <Box sx={{ display: 'inline-flex' }}>
      {options.map(option => {
        const selected = option.value === value
        return (
          <Chip
            key={option.value}
            onClick={() => onSelect(option.value)}
            clickable
            color="secondary"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography component="span" sx={{ fontSize: 16 }}>
                  {option.label}
                </Typography>
              </Box>
            }
            sx={{
              mr: 3,
              borderColor: COLORS.brandMedium,
              backgroundColor: selected ? COLORS.brandMedium : COLORS.brandMedium15,
              color: selected ? COLORS.white : COLORS.grayExtraDark,
            }}
            variant={selected ? 'outlined-selected' : 'outlined'}
          />
        )
      })}
    </Box>
  )
}
