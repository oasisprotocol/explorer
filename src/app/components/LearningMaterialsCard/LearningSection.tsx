import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { FC } from 'react'
import { AnchorCircle } from '../StyledLinks'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type LearningSectionProps = {
  className?: string
  description: string
  title: string
  url: string
}

export const LearningSection: FC<LearningSectionProps> = ({ className, description, title, url }) => {
  return (
    <div
      className={cn('flex flex-col px-6 py-5 gap-4 rounded-md border border-zinc-200 bg-zinc-50', className)}
    >
      <div className="flex-1 flex flex-col gap-1">
        <Typography variant="h4" className="mb-2">
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </div>
      <div>
        <AnchorCircle url={url} />
      </div>
    </div>
  )
}
