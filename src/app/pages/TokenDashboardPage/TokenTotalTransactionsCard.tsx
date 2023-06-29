import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import { useAccount } from '../AccountDetailsPage/hook'

export const TokenTotalTransactionsCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const address = useLoaderData() as string

  const { isFetched, account } = useAccount(scope, address)
  const value = account?.stats.num_txns

  return (
    <SnapshotCard title={t('totalTransactions.header')} withConstantHeight>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {isFetched && (
          <>
            <Typography
              component="span"
              sx={{
                fontSize: '48px',
                fontWeight: 700,
                color: COLORS.brandDark,
              }}
            >
              {t('totalTransactions.value', { value })}
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
