import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { useInstanceInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { VerificationIcon } from '../../components/ContractVerificationIcon'
import { AccountLink } from '../../components/Account/AccountLink'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { SearchScope } from '../../../types/searchScope'
import { getNFTInstanceLabel } from '../../../types/tokens'
import { useTokenInfo } from '../TokenDashboardPage/hook'

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

const VerificationStatusSkeleton: FC = () => (
  <Skeleton variant="text" sx={{ display: 'inline-block', width: '25%' }} />
)

export const InstanceTitleCard: FC<{ scope: SearchScope; contractAddress: string; instanceId: string }> = ({
  scope,
  contractAddress,
  instanceId,
}) => {
  const { isLoading, instance } = useInstanceInfo(scope, contractAddress, instanceId)
  const { isLoading: tokenLoading, token } = useTokenInfo(scope, contractAddress)

  const displayAddress = instance ? instance.eth_contract_addr || instance.contract_addr : undefined

  return (
    <Card>
      <CardContent>
        {isLoading ? (
          <TitleSkeleton />
        ) : !instance ? null : (
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
                {`${instance.token_name}: ${getNFTInstanceLabel(instance)}`}
              </Typography>
              &nbsp;
              <Typography
                variant="h2"
                sx={{
                  fontSize: 16,
                  lineHeight: '140%',
                  color: COLORS.grayMedium,
                  fontWeight: 700,
                }}
              >
                (NFT Instance)
              </Typography>
            </Box>

            {instance && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {tokenLoading ? (
                  <VerificationStatusSkeleton />
                ) : (
                  token && (
                    <VerificationIcon
                      address_eth={token.eth_contract_addr}
                      verified={token.is_verified}
                      noLink
                    />
                  )
                )}
                <AccountLink scope={scope} address={displayAddress!} />
                <CopyToClipboard value={displayAddress!} />
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
