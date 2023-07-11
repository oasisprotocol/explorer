import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useAccount } from '../AccountDetailsPage/hook'
import Skeleton from '@mui/material/Skeleton'
import { useTokenInfo } from './hook'
import { SearchScope } from '../../../types/searchScope'

export const TokenTotalTransactionsCard: FC<{ scope: SearchScope; address: string }> = ({
  scope,
  address,
}) => {
  const { t } = useTranslation()

  const { isLoading: isAccountLoading, isFetched, account } = useAccount(scope, address)
  const { isLoading: isTokenLoading } = useTokenInfo(scope, address)
  const value = account?.stats.num_txns

  const isLoading = isAccountLoading || isTokenLoading

  return (
    <SnapshotCard title={t('totalTransactions.header')} withConstantHeight>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {isLoading ? (
          <Skeleton variant="text" sx={{ width: '50%' }} />
        ) : (
          isFetched && (
            <Typography
              component="span"
              sx={{
                fontSize: '32px',
                fontWeight: 700,
                color: COLORS.brandDark,
              }}
            >
              {t('totalTransactions.value', { value })}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
