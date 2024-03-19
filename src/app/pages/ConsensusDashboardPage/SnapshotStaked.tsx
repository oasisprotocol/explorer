import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import { RoundedBalance } from '../../components/RoundedBalance'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

export const SnapshotStaked: FC = () => {
  const { t } = useTranslation()
  //  TODO: provide label and staked values when API is ready, validate percentageValue formatting
  const staked = undefined
  const percentageValue = undefined

  return (
    <SnapshotTextCard
      title={t('common.staked')}
      label={
        percentageValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ fontSize: 12, color: COLORS.grayMedium }}>
              <Trans
                t={t}
                i18nKey="consensusSnapshot.totalCirculation"
                components={{
                  StakedPercentage: (
                    <Typography component="span" sx={{ fontSize: '24px', color: COLORS.grayExtraDark }}>
                      {t('common.valuePair', {
                        value: percentageValue,
                        formatParams: {
                          value: {
                            style: 'percent',
                            maximumFractionDigits: 2,
                          } satisfies Intl.NumberFormatOptions,
                        },
                      })}
                    </Typography>
                  ),
                }}
              />
            </Typography>
          </Box>
        )
      }
    >
      {staked && (
        <Box sx={{ wordBreak: 'break-all', lineHeight: 1 }}>
          <RoundedBalance value={staked} />
        </Box>
      )}
    </SnapshotTextCard>
  )
}
