import { FC, PropsWithChildren, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@oasisprotocol/ui-library/src/components/cards'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type SnapshotCardProps = PropsWithChildren & {
  badge?: ReactNode
  label?: ReactNode
  title: ReactNode
  withContentPadding?: boolean
  alignWithCardsWithActions?: boolean
  noBorder?: boolean
}

export const SnapshotCard: FC<SnapshotCardProps> = ({
  badge,
  children,
  title,
  label,
  withContentPadding = true,
  alignWithCardsWithActions = false,
  noBorder = false,
}) => {
  return (
    <Card
      className={cn('flex-1 gap-0 p-0 m-0 h-[186px] bg-[#FAFAFA]', {
        'border-0': noBorder,
      })}
    >
      <CardHeader className="py-0 px-4 gap-0">
        <CardTitle>
          <Typography variant="h4" className="pt-4 text-sm">
            {title}
          </Typography>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn('relative h-full p-0 min-h-1 last:pb-6', { 'pt-4': withContentPadding })}>
        {children}
      </CardContent>

      {(badge || label || alignWithCardsWithActions) && (
        <CardFooter className="p-0 min-h-[60px]">
          <div className="flex justify-between items-center w-full px-4 pb-0">
            <div>{badge}</div>
            <div className="flex-1 text-muted-foreground">{label}</div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

type SnapshotTextCardProps = {
  children: ReactNode
  label?: ReactNode
  title: ReactNode
  withContentPadding?: boolean
  alignWithCardsWithActions?: boolean
}

export const SnapshotTextCard: FC<SnapshotTextCardProps> = ({
  children,
  label,
  title,
  withContentPadding,
  alignWithCardsWithActions,
}) => {
  return (
    <SnapshotCard
      title={title}
      label={label}
      withContentPadding={withContentPadding}
      alignWithCardsWithActions={alignWithCardsWithActions}
    >
      <div className="h-full flex items-center justify-center">
        <span className="text-2xl font-semibold text-primary flex-1 text-center px-4">{children}</span>
      </div>
    </SnapshotCard>
  )
}
