import { FC } from 'react'

import { SearchScope } from '../../../types/searchScope'
import { TokenLink } from './TokenLink'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import { InitialsAvatar } from '../AccountAvatar/InitialsAvatar'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
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
    <div className="flex items-center gap-2">
      <Tooltip
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
        <div className="leading-none">
          {metadata?.icon ? (
            <img src={metadata.icon} alt="" width={42} style={{ maxHeight: 32, margin: '-4px 0' }} />
          ) : (
            <InitialsAvatar
              name={metadata?.name || name || address.slice(2, 4)}
              width={42}
              style={{ maxHeight: 32, margin: '-4px 0' }}
            />
          )}
        </div>
      </Tooltip>

      <span
        style={
          alwaysTrim
            ? { whiteSpace: 'nowrap', maxWidth: '25vw', overflow: 'hidden', textOverflow: 'ellipsis' }
            : {}
        }
      >
        <TokenLink scope={scope} address={address} name={metadata?.name || name} />
        <span className="text-muted-foreground">{metadata?.origin && ` (${metadata.origin})`}</span>
      </span>
    </div>
  )
}
