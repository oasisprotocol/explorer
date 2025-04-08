import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { EvmNft } from 'oasis-nexus/api'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { trimLongString } from '../../utils/trimLongString'
import { AccountLink } from '../../components/Account/AccountLink'

type NFTLinkProps = {
  scope: SearchScope
  instance: EvmNft
}

const StyledTypography = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const NFTCollectionLink: FC<NFTLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getTokenRoute(scope, instance.token?.contract_addr)

  return (
    <StyledTypography>
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
    </StyledTypography>
  )
}

export const NFTInstanceLink: FC<NFTLinkProps> = ({ scope, instance }) => {
  const { t } = useTranslation()
  const to = RouteUtils.getNFTInstanceRoute(scope, instance.token?.eth_contract_addr, instance.id)

  return (
    <StyledTypography>
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
    </StyledTypography>
  )
}

type NFTOwnerLinkProps = {
  scope: SearchScope
  owner: string
}
export const NFTOwnerLink: FC<NFTOwnerLinkProps> = ({ scope, owner }) => {
  const { t } = useTranslation()

  return (
    <Typography sx={{ display: 'flex', whiteSpace: 'initial' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{t('nft.owner')}:</Box>
      <AccountLink scope={scope} address={owner} alwaysTrim />
    </Typography>
  )
}
