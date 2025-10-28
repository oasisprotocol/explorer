import { FC, ReactNode } from 'react'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

const TitleSkeleton: FC = () => <Skeleton className="min-w-[20ex] h-4" />

type DetailsPageTitleProps = {
  isLoading: boolean
  title: ReactNode
  details: ReactNode
}

export const DetailsPageTitle: FC<DetailsPageTitleProps> = ({ isLoading, details, title }) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-2 py-2">
      <Typography variant="h2" className="inline-flex flex-wrap">
        {isLoading ? <TitleSkeleton /> : title}
      </Typography>

      <div className="flex justify-center align-center">{isLoading ? <TitleSkeleton /> : details}</div>
    </div>
  )
}
