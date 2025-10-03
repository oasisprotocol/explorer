import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { EvmNft } from 'oasis-nexus/api'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { trimLongString } from '../../utils/trimLongString'
import { AccountLink } from '../../components/Account/AccountLink'

type NFTLinkProps = {
  scope: SearchScope
  instance: EvmNft
}

export const NFTCollectionLink: FC<NFTLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getTokenRoute(scope, instance.token?.eth_contract_addr)

  return (
    <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">
      <Trans
        i18nKey="nft.collectionLink"
        t={t}
        components={{
          CollectionLink: (
            <Link asChild>
              <RouterLink to={to}>
                {instance.token?.name ?? trimLongString(instance.token?.eth_contract_addr, 5, 5)}
              </RouterLink>
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
    <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">
      <Trans
        i18nKey="nft.instanceIdLink"
        t={t}
        components={{
          InstanceLink: (
            <Link asChild>
              <RouterLink to={to}>{instance.id}</RouterLink>
            </Link>
          ),
        }}
      />
    </Typography>
  )
}

type NFTOwnerLinkProps = {
  scope: SearchScope
  owner: string
}
export const NFTOwnerLink: FC<NFTOwnerLinkProps> = ({ scope, owner }) => {
  const { t } = useTranslation()

  return (
    <Typography className="flex whitespace-normal">
      <div className="flex items-center">{t('nft.owner')}:</div>
      &nbsp;
      <AccountLink scope={scope} address={owner} alwaysTrim />
    </Typography>
  )
}
