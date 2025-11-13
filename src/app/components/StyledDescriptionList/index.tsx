import { FC, HTMLAttributes } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface InlineDescriptionListProps extends HTMLAttributes<HTMLDListElement> {}

export const InlineDescriptionList: FC<InlineDescriptionListProps> = ({ className, ...props }) => {
  return (
    <dl
      className={cn(
        'm-0 grid [&_dd]:m-0 [&_dd]:pl-8 grid-cols-[100px_auto] sm:grid-cols-[200px_auto]',
        className,
      )}
      {...props}
    />
  )
}

interface StyledDescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  standalone?: boolean
  highlight?: boolean
}

export const StyledDescriptionList: FC<StyledDescriptionListProps> = ({
  className,
  standalone,
  highlight,
  ...props
}) => (
  <dl
    className={cn(
      'm-0 grid grid-cols-[100px_auto] sm:grid-cols-[200px_auto] [&_dd]:m-0 [&_dt]:flex [&_dd]:flex [&_dt]:flex-wrap [&_dd]:flex-wrap [&_dt]:items-start [&_dd]:items-center [&_dt]:border-b [&_dd]:border-b border-foreground-muted [&_dt]:py-2 [&_dd]:py-2 sm:[&_dt]:py-4 sm:[&_dd]:py-4 [&_dd]:overflow-hidden [&_dd]:overflow-x-hidden [&_dd]:max-w-full [&_dd]:break-words [&_dd]:pl-1 [&_dd:last-of-type]:border-b-0 [&_dt:last-of-type]:border-b-0',
      standalone && 'py-2 px-4 mb-4 rounded-md border',
      highlight && 'animate-[flash_3.5s_ease-in-out_1]',
      className,
    )}
    {...props}
  />
)

export const StyledListTitleWithAvatar: FC<HTMLAttributes<HTMLElement>> = ({ className, ...props }) => (
  <dt className={cn('py-1! sm:py-2!', className)} {...props} />
)
