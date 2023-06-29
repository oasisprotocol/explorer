import { FC } from 'react'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { ContractVerificationIcon } from '../../components/ContractVerificationIcon'
import { useAccount } from '../AccountDetailsPage/hook'
import { AccountLink } from '../../components/Account/AccountLink'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

export const TokenTitleCard: FC = () => {
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string

  const { isLoading, token } = useTokenInfo(scope, address)
  const { account } = useAccount(scope, address)

  const title = isLoading ? <TitleSkeleton /> : token?.name
  const subTitle = isLoading ? null : ` (${token?.symbol})` || null

  const addressEth = account?.address_eth

  return (
    <Card>
      <CardContent>
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
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>
            &nbsp;
            <Typography
              variant="h2"
              sx={{
                color: COLORS.grayMedium,
                fontWeight: 700,
              }}
            >
              {subTitle}
            </Typography>
          </Box>
          {addressEth && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ContractVerificationIcon
                verified={!!account?.evm_contract?.verification}
                address_eth={addressEth}
                noLink
              />
              <AccountLink scope={account} address={addressEth} />
              <CopyToClipboard value={account.address_eth || account.address} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
