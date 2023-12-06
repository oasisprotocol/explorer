import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { EvmNft } from 'oasis-nexus/api'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { trimLongString } from '../../utils/trimLongString'

type NFTLinkProps = {
  scope: SearchScope
  instance: EvmNft
}

export const NFTCollectionLink: FC<NFTLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getTokenRoute(scope, instance.token?.contract_addr)

  return (
    <Typography>
      <Trans
        i18nKey="nft.collectionLink"
        t={t}
        components={{
          CollectionLink: (
            <Link component={RouterLink} to={to}>
              {instance.token?.name ?? trimLongString(instance.token?.eth_contract_addr, 5, 5)}
            </Link>
          ),
        }}
      />
    </Typography>
  )
}

export const NFTInstanceLink: FC<NFTLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.eth_contract_addr, instance.id)

  return (
    <Typography>
      <Trans
        i18nKey="nft.instanceIdLink"
        t={t}
        components={{
          InstanceLink: (
            <Link component={RouterLink} to={to}>
              {instance.id}
            </Link>
          ),
        }}
      />
    </Typography>
  )
}
