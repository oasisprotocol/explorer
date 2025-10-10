import { FC, PropsWithChildren, ReactNode } from 'react'
import { Search } from '../Search'
import { useScreenSize } from '../../hooks/useScreensize'
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
  const { isMobile } = useScreenSize()

  return (
    <div
      className={cn(
        'relative w-full',
        action ? 'grid grid-cols-[1fr_auto_1fr]' : 'flex justify-between',
        isMobile ? 'items-center' : 'items-start',
      )}
    >
      <div>{children}</div>

      {action}

      {isMobile && enableMobileSearch && (
        <div className="w-[50px] h-[47px] ml-auto">
          <Search scope={scope} variant="expandable" />
        </div>
      )}
    </div>
  )
}
