import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { EvmNft } from 'oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
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
      <CardContent>
        {isLoading && <Skeleton variant="text" />}
        {isFetched && token && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'bottom',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                paddingBottom: 3,
              }}
            >
              {getNftInstanceLabel(nft)}
              &nbsp;
              <Typography
                component="span"
                noWrap
                sx={{
                  color: COLORS.grayMedium,
                  fontWeight: 400,
                }}
              >
                {t('nft.instanceTitleSuffix')}
              </Typography>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VerificationIcon
                address_eth={token.eth_contract_addr}
                scope={token}
                verificationLevel={token.verification_level}
                noLink
              />
              <AccountLink scope={scope} address={displayAddress!} alwaysTrim />
              <CopyToClipboard value={displayAddress!} />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
