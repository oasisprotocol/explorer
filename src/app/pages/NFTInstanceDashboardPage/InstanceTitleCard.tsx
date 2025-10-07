import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { EvmNft } from 'oasis-nexus/api'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { SearchScope } from '../../../types/searchScope'
import { getNftInstanceLabel } from '../../utils/nft'

type InstanceTitleCardProps = {
  isFetched: boolean
  isLoading: boolean
  nft: EvmNft | undefined
  scope: SearchScope
}

export const InstanceTitleCard: FC<InstanceTitleCardProps> = ({ isFetched, isLoading, nft, scope }) => {
  const { t } = useTranslation()
  const token = nft?.token
  const displayAddress = token ? token.eth_contract_addr || token.contract_addr : undefined

  return (
    <Card>
      <CardContent sx={{ paddingBottom: '0!important' }}>
        {isLoading && <Skeleton className="h-8" />}
        {isFetched && token && (
          <div className="flex flex-wrap justify-between items-center">
            <Typography variant="h2">
              {getNftInstanceLabel(nft)}
              &nbsp;
              <span className="font-normal text-muted-foreground">{t('nft.instanceTitleSuffix')}</span>
            </Typography>
            <div className="flex justify-center items-center">
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verificationLevel={token.verification_level}
                hideLink
              />
              &nbsp;&nbsp;&nbsp;
              <AccountLink scope={scope} address={displayAddress!} alwaysTrim showOnlyAddress />
              <CopyToClipboard value={displayAddress!} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
