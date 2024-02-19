import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

export const StyledCard = styled(Card)(() => ({
  '&': {
    paddingTop: '24px',
    marginBottom: '50px',
  },
}))

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

type TitleCardProps = {
  isLoading: boolean
  title: ReactNode
  details: ReactNode
}

export const TitleCard: FC<TitleCardProps> = ({ isLoading, details, title }) => {
  return (
    <StyledCard>
      <CardContent>
        {isLoading ? (
          <TitleSkeleton />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            gap={3}
          >
            <Typography
              variant="h2"
              sx={{
                display: 'inline-flex',
                fontWeight: 700,
                flexWrap: 'wrap',
              }}
            >
              {title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {details}
            </Box>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  )
}
