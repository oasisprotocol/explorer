import { FC, ReactNode } from 'react'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

const TitleSkeleton: FC = () => <Skeleton className="min-w-[20ex] h-4" />

type TitleCardProps = {
  isLoading: boolean
  title: ReactNode
  details: ReactNode
}

export const TitleCard: FC<TitleCardProps> = ({ isLoading, details, title }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6 py-2">
      <Typography variant="h2" className="inline-flex flex-wrap">
        {isLoading ? <TitleSkeleton /> : title}
      </Typography>

      <div className="flex justify-center align-center">{isLoading ? <TitleSkeleton /> : details}</div>
    </div>
  )
}
