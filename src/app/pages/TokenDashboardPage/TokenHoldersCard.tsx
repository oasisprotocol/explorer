import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { useTokenInfo } from './hook'
import { useLoaderData } from 'react-router-dom'

export const TokenHoldersCard: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()

  const address = useLoaderData() as string

  const { token, isFetched } = useTokenInfo(scope, address)

  const title = t('tokens.holders')
  return (
    <SnapshotCard title={title} withConstantHeight>
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
              {t('tokens.holdersValue', { value: token?.num_holders })}
            </Typography>
          </>
        )}
      </Box>
    </SnapshotCard>
  )
}
