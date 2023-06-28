import { FC, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&': {
    padding: 0,
  },
  height: 186,
}))

const StyledCardContent = styled(CardContent, {
  shouldForwardProp: prop => prop !== 'withContentPadding',
})<{ withContentPadding: boolean }>(({ theme, withContentPadding }) => ({
  position: 'relative',
  paddingTop: theme.spacing(withContentPadding ? 4 : 0),
  height: '100%',
}))

type SnapshotCardProps = PropsWithChildren & {
  badge?: ReactNode
  label?: string
  title: ReactNode
  withContentPadding?: boolean
}

export const SnapshotCard: FC<SnapshotCardProps> = ({
  badge,
  children,
  title,
  label,
  withContentPadding = true,
}) => {
  return (
    <StyledCard>
      <CardHeader component="h5" title={title} sx={{ pb: 0, pl: 4, pt: 4 }} />
      <StyledCardContent withContentPadding={withContentPadding}>{children}</StyledCardContent>
      {(badge || label) && (
        <CardActions sx={{ minHeight: 60 }}>
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
            <Typography variant="h2" sx={{ fontWeight: 'fontWeightRegular' }}>
              {label}
            </Typography>
          </Box>
        </CardActions>
      )}
    </StyledCard>
  )
}
