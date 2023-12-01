import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { RouteUtils } from '../../utils/route-utils'
import { EvmNft } from 'oasis-nexus/api'
import { SearchScope } from 'types/searchScope'

type NFTInstanceLinkProps = {
  scope: SearchScope
  instance: EvmNft
}

export const NFTInstanceLink: FC<NFTInstanceLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.contract_addr, instance.id)

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
