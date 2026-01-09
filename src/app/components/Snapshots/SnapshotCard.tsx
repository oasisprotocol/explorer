import { FC, PropsWithChildren, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@oasisprotocol/ui-library/src/components/card'
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
      className={cn('flex-1 gap-0 p-6 m-0 h-[204px] bg-[#FAFAFA]', {
        'border-0': noBorder,
      })}
    >
      <CardHeader className="p-0 gap-0">
        <CardTitle>
          <Typography variant="h4" className="flex-1 text-sm">
            {title}
          </Typography>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn('relative h-full p-0 min-h-1 last:pb-6', { 'pt-4': withContentPadding })}>
        {children}
      </CardContent>

      {(badge || label || alignWithCardsWithActions) && (
        <CardFooter className="p-0 min-h-[36px]">
          <div>{badge}</div>
          <div className="flex-1 text-muted-foreground">{label}</div>
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
        <span className="text-2xl font-semibold text-primary flex-1 text-center">{children}</span>
      </div>
    </SnapshotCard>
  )
}
