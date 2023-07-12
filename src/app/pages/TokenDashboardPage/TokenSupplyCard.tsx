import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { SearchScope } from '../../../types/searchScope'

export const TokenSupplyCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard
      title={t('tokens.totalSupply')}
      label={isLoading ? <Skeleton variant="text" sx={{ width: '4em' }} /> : token?.symbol}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {isLoading ? (
          <Skeleton variant="text" sx={{ width: '50%' }} />
        ) : (
          isFetched &&
          token && (
            <Typography
              component="span"
              sx={{
                fontSize: '32px',
                fontWeight: 700,
                color: COLORS.brandDark,
                textAlign: 'center',
                width: '100%',
              }}
            >
              {token.total_supply
                ? t('tokens.totalSupplyValue', { value: token.total_supply })
                : t('common.undefined')}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
