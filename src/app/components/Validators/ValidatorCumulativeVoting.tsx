import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'value' && prop !== 'containerMarginThemeSpacing',
})<ValidatorCumulativeVotingProps>(({ containerMarginThemeSpacing, value, theme }) => ({
  position: 'relative',
  textAlign: 'center',
  '&::before': {
    content: '""',
    width: `${value}%`,
    height: `calc(100% + ${theme.spacing(containerMarginThemeSpacing)})`,
    borderRight: 'solid 5px #6665D860',
    backgroundColor: '#6665D820',
    position: 'absolute',
    left: 0,
    top: `-${theme.spacing(containerMarginThemeSpacing - 1)}`,
  },
}))

type ValidatorCumulativeVotingProps = {
  containerMarginThemeSpacing: number
  value: number
}

export const ValidatorCumulativeVoting: FC<ValidatorCumulativeVotingProps> = ({
  containerMarginThemeSpacing,
  value,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <StyledBox value={value} containerMarginThemeSpacing={containerMarginThemeSpacing}>
        <Typography component="span" sx={{ position: 'relative', zIndex: 2 }}>
          {value ? value : '-'}
        </Typography>
      </StyledBox>
    </Box>
  )
}
