import { FC, ReactNode } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type MenuItemProps = {
  children: ReactNode
  selected?: boolean
  divider?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
  disabled?: boolean
}

export const MenuItem: FC<MenuItemProps> = ({
  children,
  selected,
  divider,
  onMouseEnter,
  onMouseLeave,
  onClick,
  disabled,
}) => {
  return (
    <li
      className={cn(
        'flex items-center max-md:min-h-12 px-4 py-1.5 cursor-pointer hover:bg-border/50',
        selected && 'text-primary bg-border',
        divider && 'border-b',
        disabled && 'cursor-default text-muted-foreground hover:bg-transparent',
      )}
      role="menuitem"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      tabIndex={selected ? 0 : -1}
    >
      {children}
    </li>
  )
}
