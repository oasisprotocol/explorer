import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import Skeleton from '@mui/material/Skeleton'
import { useTokenInfo } from './hook'
import { SearchScope } from '../../../types/searchScope'

export const TokenTotalTransactionsCard: FC<{ scope: SearchScope; address: string }> = ({
  scope,
  address,
}) => {
  const { t } = useTranslation()
  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard title={t('common.transfers')} withConstantHeight>
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
              {t('common.valuePair', { value: token?.num_transfers })}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
