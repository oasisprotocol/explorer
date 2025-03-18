import { FC, ReactNode, useEffect } from 'react'
import { useAddressHighlighting } from './index'
import { COLORS } from '../../../styles/theme/colors'
import Box from '@mui/material/Box'

export const WithHighlighting: FC<{ children: ReactNode; address: string }> = ({ children, address }) => {
  const { highlightedAddress, highlightAddress, releaseAddress } = useAddressHighlighting()
  useEffect(() => () => releaseAddress(address)) // Release address on umount
  const isHighlighted = !!highlightedAddress && highlightedAddress.toLowerCase() === address.toLowerCase()
  return (
    <Box
      onMouseEnter={() => highlightAddress(address)}
      onMouseLeave={() => releaseAddress(address)}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        padding: '2px 4px 2px 4px',
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
