import { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'value',
})<{ value: number }>(({ value, theme }) => ({
  position: 'relative',
  textAlign: 'center',
  '&::before': {
    content: '""',
    width: `${value}%`,
    height: `calc(100% + ${theme.spacing(5)})`,
    borderRight: 'solid 5px #6665D860',
    backgroundColor: '#6665D820',
    position: 'absolute',
    left: 0,
    top: `-${theme.spacing(4)}`,
  },
}))

type ValidatorCumulativeVotingProps = {
  value: number
}

export const ValidatorCumulativeVoting: FC<ValidatorCumulativeVotingProps> = ({ value }) => {
  return (
    <Box>
      <StyledBox value={value}>
        <Typography component="span" sx={{ position: 'relative', zIndex: 2 }}>
          {value ? value : '-'}
        </Typography>
      </StyledBox>
    </Box>
  )
}
