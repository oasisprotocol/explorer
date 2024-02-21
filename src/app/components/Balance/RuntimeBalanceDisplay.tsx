import { FC } from 'react'
import { RuntimeSdkBalance } from '../../../oasis-nexus/api'
import { useTranslation } from 'react-i18next'
import { getPreciseNumberFormat } from '../../../locales/getPreciseNumberFormat'
import Box from '@mui/material/Box'

export const RuntimeBalanceDisplay: FC<{ balances: RuntimeSdkBalance[] | undefined }> = ({
  balances = [],
}) => {
  const { t } = useTranslation()
  if (balances.length === 0 || balances[0].balance === undefined) {
    return t('common.missing')
  }
  return (
    <Box>
      {balances.map(balance => (
        <div key={balance.token_symbol}>
          {t('common.valueInToken', {
            ...getPreciseNumberFormat(balance.balance),
            ticker: balance.token_symbol,
          })}
        </div>
      ))}
    </Box>
  )
}
