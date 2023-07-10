import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTokenInfo } from './hook'
import { useLoaderData } from 'react-router-dom'
import { getTokenTypeName } from '../../../types/tokens'
import Skeleton from '@mui/material/Skeleton'

export const TokenTypeCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const address = useLoaderData() as string

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard title={t('common.type')} withConstantHeight>
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
              {token?.type ? getTokenTypeName(t, token.type) : '-'}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
