import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type FilterButtonsProps<T extends string> = {
  options: { label: string; value: T }[]
  onSelect: (value: T) => void
  value?: NoInfer<T>
}

export const FilterButtons = <T extends string>({ options, onSelect, value }: FilterButtonsProps<T>) => {
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
              <Box
                component="span"
                sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}
              >
                {selected && <CheckIcon fontSize={'small'} sx={{ transform: 'translateY(4px)', mt: -5 }} />}
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
