import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

export const TokenTitleCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, token } = useTokenInfo(scope, address)

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <TitleSkeleton />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: '50%',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                }}
              >
                {token?.name ?? t('common.missing')}
              </Typography>
              &nbsp;
              <Typography
                variant="h2"
                sx={{
                  color: COLORS.grayMedium,
                  fontWeight: 700,
                }}
              >
                {token?.symbol ?? t('common.missing')}
              </Typography>
            </Box>

            {token && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <VerificationIcon address_eth={token.eth_contract_addr} verified={token.is_verified} noLink />
                <AccountLink scope={token} address={token.eth_contract_addr || token.contract_addr} />
                <CopyToClipboard value={token.eth_contract_addr || token.contract_addr} />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
