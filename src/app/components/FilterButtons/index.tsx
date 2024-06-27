import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

type FilterButtonsProps<T> = {
  options: { label: string; value: T }[]
  onSelect: (value: T) => void
  value?: T
}

export const FilterButtons = <T,>({ options, onSelect, value }: FilterButtonsProps<T>) => {
  return (
    <Box sx={{ display: 'inline-flex' }}>
      {options.map(option => {
        const selected = option.value === value
        return (
          <Chip
            key={String(option.value)}
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
