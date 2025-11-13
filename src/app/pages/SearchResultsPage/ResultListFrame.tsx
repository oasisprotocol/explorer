import { FC } from 'react'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { useScreenSize } from '../../hooks/useScreensize'
import { useScopeParam } from 'app/hooks/useScopeParam'

export const ResultListFrame: FC<{ children: React.ReactNode; networkForTheme: string }> = ({
  children,
  networkForTheme,
}) => {
  const { isMobile } = useScreenSize()
  const scope = useScopeParam()
  const fallbackTheme = 'mainnet'
  const expectedTheme = scope?.network ?? fallbackTheme

  return isMobile ? (
    <div
      className={cn(
        expectedTheme !== networkForTheme &&
          '[&_>_div_>_[data-slot="card"]]:rounded-none [&_>_div_>_[data-slot="card"]]:border-solid [&_>_div_>_[data-slot="card"]]:border-theme-layout-accent [&_>_div_>_[data-slot="card"]]:border-y-[10px] [&_>_div_>_[data-slot="card"]]:border-x',
        networkForTheme,
      )}
    >
      {children}
    </div>
  ) : (
    <div
      className={cn(
        'mb-5 border-[15px] border-solid border-theme-layout-accent bg-white rounded-md',
        networkForTheme,
      )}
    >
      {children}
    </div>
  )
}
