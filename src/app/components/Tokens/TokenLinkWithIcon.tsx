import { FC } from 'react'

import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from './TokenLink'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import { InitialsAvatar } from '../AccountAvatar/InitialsAvatar'
import Tooltip from '@mui/material/Tooltip'
import { Trans, useTranslation } from 'react-i18next'

export const TokenLinkWithIcon: FC<{
  scope: SearchScope
  address: string
  name: string | undefined
  alwaysTrim?: boolean
}> = ({ scope, address, name, alwaysTrim }) => {
  const { t } = useTranslation()
  const { metadata } = useAccountMetadata(scope, address)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Tooltip
        placement="top"
        arrow
        slotProps={{ tooltip: { sx: { fontWeight: 'normal' } } }}
        title={
          metadata?.origin && (
            <Trans
              t={t}
              i18nKey="tokens.originTooltip"
              values={{
                origin: metadata.origin,
              }}
            />
          )
        }
      >
        <Box sx={{ lineHeight: 0 }}>
          {metadata?.icon ? (
            <img src={metadata.icon} alt="" width={42} style={{ maxHeight: 32, margin: '-4px 0' }} />
          ) : (
            <InitialsAvatar
              name={metadata?.name || name || address.slice(2, 4)}
              width={42}
              style={{ maxHeight: 32, margin: '-4px 0' }}
            />
          )}
        </Box>
      </Tooltip>

      <span
        style={
          alwaysTrim
            ? { whiteSpace: 'nowrap', maxWidth: '25vw', overflow: 'hidden', textOverflow: 'ellipsis' }
            : {}
        }
      >
        <TokenLink scope={scope} address={address} name={metadata?.name || name} />
        <Box component="span" sx={{ color: COLORS.grayMedium }}>
          {metadata?.origin && ` (${metadata.origin})`}
        </Box>
      </span>
    </Box>
  )
}
