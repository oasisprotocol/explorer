import { FC, PropsWithChildren, ReactNode } from 'react'
import { Search } from '../Search'
import { SearchScope } from '../../../types/searchScope'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface AppendMobileSearchProps {
  action?: ReactNode
  enableMobileSearch?: boolean
}

export const AppendMobileSearch: FC<PropsWithChildren<AppendMobileSearchProps> & { scope?: SearchScope }> = ({
  scope,
  children,
  action,
  enableMobileSearch = true,
}) => {
  return (
    <div
      className={cn(
        'relative w-full items-center sm:items-start',
        action ? 'grid grid-cols-[1fr_auto_1fr]' : 'flex justify-between',
        enableMobileSearch ? 'justify-between' : 'justify-center',
      )}
    >
      <div>{children}</div>

      {action}

      {enableMobileSearch && (
        <div className="w-[40px] h-[40px] ml-auto sm:hidden">
          <Search scope={scope} expandable />
        </div>
      )}
    </div>
  )
}
