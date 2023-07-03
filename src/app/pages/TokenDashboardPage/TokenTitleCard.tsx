import { FC } from 'react'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { DelayedContractVerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

export const TokenTitleCard: FC = () => {
  const scope = useRequiredScopeParam()
  const address = useLoaderData() as string

  const { isLoading, token } = useTokenInfo(scope, address)

  const title = isLoading ? <TitleSkeleton /> : token?.name
  const subTitle = isLoading ? null : ` (${token?.symbol})` || null

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

          {token && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DelayedContractVerificationIcon
                scope={token}
                contractOasisAddress={token.contract_addr}
                noLink
              />
              <AccountLink scope={token} address={token.eth_contract_addr || token.contract_addr} />
              <CopyToClipboard value={token.eth_contract_addr || token.contract_addr} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
