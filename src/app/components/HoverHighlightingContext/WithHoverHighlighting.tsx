import { FC, ReactNode, useEffect } from 'react'
import { useHoverHighlighting } from './index'
import { COLORS } from '../../../styles/theme/colors'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'

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
    <Box
      onMouseEnter={() => selectAddress(address)}
      onMouseLeave={() => releaseAddress(address)}
      component="span"
      sx={{
        display: 'inline-flex',
        ...(isHighlighted
          ? {
              background: COLORS.warningLight,
              border: `1px dashed ${COLORS.warningColor}`,
              borderRadius: '6px',
            }
          : {
              border: `1px dashed transparent`,
            }),
      }}
    >
      {children}
    </Box>
  )
}
