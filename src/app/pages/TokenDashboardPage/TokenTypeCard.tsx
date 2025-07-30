import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useTokenInfo } from './hook'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { getTokenTypeDescription, getTokenTypeStrictName } from '../../../types/tokens'
import { RuntimeScope } from '../../../types/searchScope'

export const TokenTypeCard: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard title={t('common.type')} alignWithCardsWithActions>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
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
