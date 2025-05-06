import { FC } from 'react'

import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from './TokenLink'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { InitialsAvatar } from '../AccountAvatar/InitialsAvatar'

export const TokenLinkWithIcon: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
  highlightedPart?: string | undefined
}> = ({ scope, address, name, highlightedPart }) => {
  const { metadata } = useAccountMetadata(scope, address)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {metadata?.icon ? (
        <img src={metadata.icon} alt="" width={40} style={{ maxHeight: 32, margin: '-4px 0' }} />
      ) : (
        <InitialsAvatar
          name={metadata?.name || name || address.slice(2, 4)}
          width={40}
          style={{ maxHeight: 32, margin: '-4px 0' }}
        />
      )}

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
