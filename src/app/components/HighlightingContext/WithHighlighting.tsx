import { FC, ReactNode, useEffect } from 'react'
import { useAddressHighlighting } from './index'
import { COLORS } from '../../../styles/theme/colors'
import Box from '@mui/material/Box'
import { useScreenSize } from '../../hooks/useScreensize'

export const WithHighlighting: FC<{ children: ReactNode; address: string }> = ({ children, address }) => {
  const { highlightedAddress, highlightAddress, releaseAddress } = useAddressHighlighting()
  useEffect(() => {
    // Release address on unmount
    return () => releaseAddress(address)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Don't trigger on every render
  }, [address])
  const { isTablet } = useScreenSize()
  // We have decided that we only want this feature on desktop,
  // so we are on tablet (or mobile), just return the wrapped contnt directly.
  const isHighlighted =
    !isTablet && !!highlightedAddress && highlightedAddress.toLowerCase() === address.toLowerCase()
  return (
    <Box
      onMouseEnter={() => highlightAddress(address)}
      onMouseLeave={() => releaseAddress(address)}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        padding: '2px 4px',
        margin: '-3px -5px',
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
