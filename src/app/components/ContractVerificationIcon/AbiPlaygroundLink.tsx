import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import { Layer } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { Network } from '../../../types/network'
import * as externalLinks from '../../utils/externalLinks'
import Box from '@mui/material/Box'

export const AbiPlaygroundLink: FC<{
  address_eth: string
  scope: SearchScope
}> = ({ address_eth, scope }) => {
  const { t } = useTranslation()

  const scopeToPlaygroundURL: Record<Network, Partial<Record<Layer, string>>> = {
    [Network.mainnet]: {
      emerald: `${externalLinks.dapps.abiPlayground}?network=42262&contractAddress=${address_eth}`,
      sapphire: `${externalLinks.dapps.abiPlayground}?network=23294&contractAddress=${address_eth}`,
    },
    [Network.testnet]: {
      emerald: `${externalLinks.dapps.abiPlayground}?network=42261&contractAddress=${address_eth}`,
      sapphire: `${externalLinks.dapps.abiPlayground}?network=23295&contractAddress=${address_eth}`,
    },
    [Network.localnet]: {
      emerald: `${externalLinks.dapps.abiPlayground}?network=42260&contractAddress=${address_eth}`,
      sapphire: `${externalLinks.dapps.abiPlayground}?network=23293&contractAddress=${address_eth}`,
    },
  }
  const abiPlaygroundLinkProps = {
    href: scopeToPlaygroundURL[scope.network]?.[scope.layer],
    rel: 'noopener noreferrer',
    target: '_blank',
    sx: { fontWeight: 400, color: 'inherit', textDecoration: 'underline' },
  }

  if (!abiPlaygroundLinkProps.href) return null
  return (
    <span>
      &nbsp;|&nbsp;
      <Box sx={{ display: 'inline-block' }}>
        <Trans
          t={t}
          i18nKey={'contract.verification.openInAbiPlayground'}
          components={{
            AbiPlaygroundLink: <Link {...abiPlaygroundLinkProps} />,
          }}
        />
      </Box>
    </span>
  )
}
