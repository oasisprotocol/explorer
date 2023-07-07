import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTokenInfo } from './hook'
import { useLoaderData } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'

export const TokenSupplyCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const address = useLoaderData() as string

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  const supplyString = token?.total_supply

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
                fontSize: '48px',
                fontWeight: 700,
                color: COLORS.brandDark,
                textAlign: 'center',
                width: '100%',
              }}
            >
              {!supplyString ? t('common.missing') : t('tokens.totalSupplyValue', { value: supplyString })}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
