import { FC, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { CardActions } from '@mui/material'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { PercentageGain } from '../../components/PercentageGain'

export const StyledCard = styled(Card)(({ theme }) => ({
  flex: 1,
  // used to create a stronger selector to override default theme styles
  [theme.breakpoints.down('sm')]: {
    padding: 0,
  },
  [theme.breakpoints.up('sm')]: {
    padding: 0,
  },
}))

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(4),
}))

type SnapshotCardProps = PropsWithChildren & {
  badge?: ReactNode
  label?: string
  title: string
}

export const SnapshotCard: FC<SnapshotCardProps> = ({ badge, children, title, label }) => {
  return (
    <StyledCard>
      <CardHeader component="h5" title={title} sx={{ pb: 0, pl: 4, pt: 4 }} />
      <StyledCardContent>{children}</StyledCardContent>
      <CardActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            px: 3,
            pb: 3,
          }}
        >
          <Box>{badge}</Box>
          <Typography variant="h2" sx={{ pr: 4, fontWeight: 'fontWeightRegular' }}>
            {label}
          </Typography>
        </Box>
      </CardActions>
    </StyledCard>
  )
}
