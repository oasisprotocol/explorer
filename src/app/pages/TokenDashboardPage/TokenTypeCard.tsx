import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import Skeleton from '@mui/material/Skeleton'
import { getTokenTypeDescription, getTokenTypeStrictName } from '../../../types/tokens'
import { SearchScope } from '../../../types/searchScope'

export const TokenTypeCard: FC<{ scope: SearchScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard title={t('common.type')} alignWithCardsWithActions>
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
                textAlign: 'center',
              }}
            >
              {token?.type ? (
                <>
                  {getTokenTypeDescription(t, token.type)}
                  <Typography
                    component="span"
                    sx={{
                      display: 'flex',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: COLORS.grayMedium,
                    }}
                  >
                    ({getTokenTypeStrictName(t, token.type)})
                  </Typography>
                </>
              ) : (
                '-'
              )}
            </Typography>
          )
        )}
      </Box>
    </SnapshotCard>
  )
}
