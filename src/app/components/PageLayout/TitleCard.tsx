import { FC, ReactNode } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { styled } from '@mui/material/styles'

export const StyledCard = styled(Card)(() => ({
  '&': {
    paddingTop: '24px',
    marginBottom: '50px',
  },
}))

const TitleSkeleton: FC = () => <Skeleton className="min-w-[20ex] h-4" />

type TitleCardProps = {
  isLoading: boolean
  title: ReactNode
  details: ReactNode
}

export const TitleCard: FC<TitleCardProps> = ({ isLoading, details, title }) => {
  return (
    <StyledCard>
      <CardContent sx={{ paddingBottom: '0!important' }}>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <Typography variant="h2" className="inline-flex flex-wrap">
            {isLoading ? <TitleSkeleton /> : title}
          </Typography>

          <div className="flex justify-center align-center">{isLoading ? <TitleSkeleton /> : details}</div>
        </div>
      </CardContent>
    </StyledCard>
  )
}
