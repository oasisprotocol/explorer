import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useAccount } from '../RuntimeAccountDetailsPage/hook'
import { SearchScope } from '../../../types/searchScope'

export const TokenGasUsedCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { account, isFetched } = useAccount(scope, address)

  return (
    <SnapshotCard title={t('common.gasUsed')} alignWithCardsWithActions>
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
