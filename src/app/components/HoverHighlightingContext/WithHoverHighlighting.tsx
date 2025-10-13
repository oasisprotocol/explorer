import { FC, ReactNode, useEffect } from 'react'
import { useHoverHighlighting } from './index'
import { useScreenSize } from '../../hooks/useScreensize'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export const WithHoverHighlighting: FC<{ children: ReactNode; address: string }> = ({
  children,
  address,
}) => {
  const { shouldHighlight, selectAddress, releaseAddress } = useHoverHighlighting()
  useEffect(() => {
    // Release address on unmount
    return () => releaseAddress(address)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Don't trigger on every render
  }, [address])
  const { isTablet } = useScreenSize()
  // We have decided that we only want this feature on desktop,
  // so we are on tablet (or mobile), just return the wrapped contnt directly.
  const isHighlighted = !isTablet && shouldHighlight(address)
  return (
    <span
      onMouseEnter={() => selectAddress(address)}
      onMouseLeave={() => releaseAddress(address)}
      className={cn(
        'inline-flex',
        'border border-dashed rounded-md',
        isHighlighted ? 'bg-orange-50 border-orange-600' : 'border-transparent',
      )}
    >
      {children}
    </span>
  )
}
