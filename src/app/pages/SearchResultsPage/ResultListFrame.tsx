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

  return (
    <div
      className={cn(
        !isMobile && 'mb-5 border-[15px] border-solid border-theme-layout-accent bg-white rounded-md',
        isMobile && expectedTheme !== networkForTheme && 'mobile-card-border-override',
        networkForTheme,
      )}
    >
      {children}
    </div>
  )
}
