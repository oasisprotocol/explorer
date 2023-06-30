import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useLoaderData } from 'react-router-dom'
import { useAccount } from '../AccountDetailsPage/hook'

export const TokenGasUsedCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const address = useLoaderData() as string

  const { account, isFetched } = useAccount(scope, address)

  console.log('Account', account)

  return (
    <SnapshotCard title={t('common.gasUsed')} withConstantHeight>
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
              {
                // TODO: return "gas used" here, when it becomes available
                account?.stats.num_txns
              }
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
