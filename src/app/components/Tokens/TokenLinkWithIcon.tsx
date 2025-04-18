import { FC } from 'react'

import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from './TokenLink'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'

export const TokenLinkWithIcon: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
  highlightedPart?: string | undefined
}> = ({ scope, address, name, highlightedPart }) => {
  const { metadata } = useAccountMetadata(scope, address)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {metadata?.icon && <img src={metadata.icon} alt="" width={28} />}

      <span>
        <TokenLink
          scope={scope}
          address={address}
          name={metadata?.name || name}
          highlightedPart={highlightedPart}
        />
        <Box component="span" sx={{ color: COLORS.grayMedium }}>
          {metadata?.origin && ` (${metadata.origin})`}
        </Box>
      </span>
    </Box>
  )
}
