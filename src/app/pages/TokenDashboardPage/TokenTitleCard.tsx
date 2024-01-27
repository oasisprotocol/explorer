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
import { styled } from '@mui/material/styles'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { HighlightedText } from '../../components/HighlightedText'

export const StyledCard = styled(Card)(() => ({
  '&': {
    paddingTop: '24px', // custom spacing
    marginBottom: '50px',
  },
}))

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

export const TokenTitleCard: FC<{ scope: SearchScope; address: string; searchTerm: string }> = ({
  scope,
  address,
  searchTerm,
}) => {
  const { t } = useTranslation()
  const { isLoading, token } = useTokenInfo(scope, address)

  return (
    <StyledCard>
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
            gap={3}
          >
            <Typography
              variant="h2"
              sx={{
                display: 'inline-flex',
                fontWeight: 700,
                flexWrap: 'wrap',
              }}
            >
              {token?.name ? <HighlightedText text={token.name} pattern={searchTerm} /> : t('common.missing')}
              &nbsp;
              <Typography
                component="span"
                sx={{
                  color: COLORS.grayMedium,
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                {token?.symbol ? (
                  <HighlightedText text={token.symbol} pattern={searchTerm} />
                ) : (
                  t('common.missing')
                )}
              </Typography>
            </Typography>

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
    </StyledCard>
  )
}
