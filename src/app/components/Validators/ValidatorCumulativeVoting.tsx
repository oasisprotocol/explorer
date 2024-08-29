import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { PercentageValue } from '../PercentageValue'

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'value' && prop !== 'containerMarginThemeSpacing',
})<Omit<ValidatorCumulativeVotingProps, 'total'>>(({ containerMarginThemeSpacing, value, theme }) => ({
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
  value: number | undefined
  total: number | undefined
}

export const ValidatorCumulativeVoting: FC<ValidatorCumulativeVotingProps> = ({
  containerMarginThemeSpacing,
  value,
  total,
}) => {
  if (typeof value !== 'number' || typeof total !== 'number' || total <= 0) {
    return null
  }

  return (
    <Box sx={{ flex: 1 }}>
      <StyledBox value={(value / total) * 100} containerMarginThemeSpacing={containerMarginThemeSpacing}>
        <Typography component="span" sx={{ position: 'relative', zIndex: 2 }}>
          <PercentageValue value={value} total={total} />
        </Typography>
      </StyledBox>
    </Box>
  )
}
